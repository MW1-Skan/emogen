// ===========================
// Configuration
// ===========================

const CONFIG = {
    API_ENDPOINT: 'https://api-lkr3ru3foq-uc.a.run.app/api/emojiFlow',
    MAX_HISTORY_ITEMS: 10, // Store 10 emoji sets (30 emojis = 1.5 grids)
    TOAST_DURATION: 2000,
    COPY_FEEDBACK_DURATION: 500, // Green overlay duration
    COPY_TEXT_DURATION: 1000, // Text change duration
};

// ===========================
// DOM Elements
// ===========================

const elements = {
    // Tabs
    tabs: document.querySelectorAll('.tab-button'),
    tabContents: document.querySelectorAll('.tab-content'),

    // Input
    moodInput: document.getElementById('mood-input'),
    charCount: document.getElementById('char-count'),
    generateBtn: document.getElementById('generate-btn'),

    // Results
    resultsSection: document.getElementById('results-section'),
    emojiGrid: document.getElementById('emoji-grid'),

    // Loading & Error
    loadingSection: document.getElementById('loading-section'),
    errorSection: document.getElementById('error-section'),
    errorMessage: document.getElementById('error-message'),
    retryBtn: document.getElementById('retry-btn'),

    // History
    historyList: document.getElementById('history-list'),
    historyEmpty: document.getElementById('history-empty'),
    historyCopyIndicator: document.getElementById('history-copy-indicator'),

    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message'),
};

// ===========================
// State Management
// ===========================

let currentPrompt = '';
let currentEmojiSet = null;

// ===========================
// Chrome Storage Helpers
// ===========================

async function getFromStorage(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
            resolve(result[key] || null);
        });
    });
}

async function saveToStorage(key, value) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, resolve);
    });
}

// ===========================
// History & Favorites Management
// ===========================

async function saveToHistory(emojiSet) {
    let history = (await getFromStorage('history')) || [];

    // Add to beginning of array
    history.unshift(emojiSet);

    // Limit to MAX_HISTORY_ITEMS
    if (history.length > CONFIG.MAX_HISTORY_ITEMS) {
        history = history.slice(0, CONFIG.MAX_HISTORY_ITEMS);
    }

    await saveToStorage('history', history);
    return history;
}

async function loadHistory() {
    const history = (await getFromStorage('history')) || [];
    renderHistory(history);
    return history;
}

// Favorites functionality removed per user request

// ===========================
// API Integration
// ===========================

async function generateEmojis(prompt) {
    try {
        const response = await fetch(CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                count: 3,
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error generating emojis:', error);
        throw error;
    }
}

// ===========================
// UI Rendering
// ===========================

function renderEmojiCards(emojiSet) {
    elements.emojiGrid.innerHTML = '';

    emojiSet.emojis.forEach((emoji) => {
        const card = document.createElement('div');
        card.className = 'emoji-card';
        card.innerHTML = `
      <div class="emoji-display">${emoji}</div>
      <div class="copy-hint">Click to copy</div>
    `;

        card.addEventListener('click', () => {
            copyToClipboard(emoji, card);
        });

        elements.emojiGrid.appendChild(card);
    });
}

function renderHistory(history) {
    // Flatten history into individual emojis
    const allEmojis = [];
    history.forEach((emojiSet) => {
        if (emojiSet.emojis && Array.isArray(emojiSet.emojis)) {
            emojiSet.emojis.forEach((emoji) => {
                allEmojis.push(emoji);
            });
        }
    });

    // Show last 16 emojis (4 columns × 4 rows)
    const displayEmojis = allEmojis.slice(0, 16);

    if (displayEmojis.length === 0) {
        elements.historyList.innerHTML = '';
        elements.historyEmpty.classList.remove('hidden');
        return;
    }

    elements.historyEmpty.classList.add('hidden');
    elements.historyList.innerHTML = '';

    // Create emoji cards
    displayEmojis.forEach((emoji) => {
        const card = createEmojiCard(emoji);
        elements.historyList.appendChild(card);
    });
}

function createEmojiCard(emoji) {
    const card = document.createElement('div');
    card.className = 'history-emoji-card';
    card.textContent = emoji;

    card.addEventListener('click', () => {
        copyToClipboard(emoji, card);
        showHistoryCopyIndicator();
    });

    return card;
}

// ===========================
// UI State Management
// ===========================

function showLoading() {
    elements.resultsSection.classList.add('hidden');
    elements.errorSection.classList.add('hidden');
    elements.loadingSection.classList.remove('hidden');
    elements.generateBtn.disabled = true;
}

function hideLoading() {
    elements.loadingSection.classList.add('hidden');
    elements.generateBtn.disabled = false;
}

function showResults() {
    elements.loadingSection.classList.add('hidden');
    elements.errorSection.classList.add('hidden');
    elements.resultsSection.classList.remove('hidden');
    elements.generateBtn.disabled = false; // Ensure button is re-enabled
}

function showError(message) {
    elements.loadingSection.classList.add('hidden');
    elements.resultsSection.classList.add('hidden');
    elements.errorMessage.textContent = message;
    elements.errorSection.classList.remove('hidden');
    elements.generateBtn.disabled = false;
}

function showToast(message) {
    elements.toastMessage.textContent = message;
    elements.toast.classList.add('show');

    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, CONFIG.TOAST_DURATION);
}

function showHistoryCopyIndicator() {
    elements.historyCopyIndicator.classList.add('show');

    setTimeout(() => {
        elements.historyCopyIndicator.classList.remove('show');
    }, 1000); // Show for 1 second
}

function switchTab(tabName) {
    // Update tab buttons
    elements.tabs.forEach((tab) => {
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Update tab contents
    elements.tabContents.forEach((content) => {
        if (content.id === `${tabName}-tab`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });

    // Load data for history tab
    if (tabName === 'history') {
        loadHistory();
    }
}

// ===========================
// Utility Functions
// ===========================

function copyToClipboard(text, element = null) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard! ✨');

        // Add visual feedback with green overlay
        if (element) {
            element.classList.add('copy-success');

            // Change text to "✓ Copied!" if it's an emoji card
            const copyHint = element.querySelector('.copy-hint');
            if (copyHint) {
                const originalText = copyHint.textContent;
                copyHint.textContent = '✓ Copied!';
                copyHint.classList.add('copied');

                setTimeout(() => {
                    copyHint.textContent = originalText;
                    copyHint.classList.remove('copied');
                }, CONFIG.COPY_TEXT_DURATION);
            }

            setTimeout(() => {
                element.classList.remove('copy-success');
            }, CONFIG.COPY_FEEDBACK_DURATION);
        }
    }).catch((err) => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy');
    });
}

function generateId() {
    return `emoji_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ===========================
// Event Handlers
// ===========================

async function handleGenerate() {
    const prompt = elements.moodInput.value.trim();

    if (!prompt) {
        showToast('Please enter a mood or vibe');
        return;
    }

    currentPrompt = prompt;
    showLoading();

    try {
        const result = await generateEmojis(prompt);

        // Add ID and timestamp if not present
        const emojiSet = {
            id: result.id || generateId(),
            prompt: result.prompt || prompt,
            emojis: result.emojis,
            timestamp: result.timestamp || new Date().toISOString(),
            model: result.model,
            notes: result.notes,
        };

        currentEmojiSet = emojiSet;

        // Save to history
        await saveToHistory(emojiSet);

        // Render results
        renderEmojiCards(emojiSet);
        showResults();

    } catch (error) {
        console.error('Generate error:', error);

        if (error.message.includes('Failed to fetch')) {
            showError('Cannot connect to API. Please check your connection.');
        } else {
            showError('Something went wrong. Please try again.');
        }
    }
}

function handleRetry() {
    if (currentPrompt) {
        handleGenerate();
    }
}

function updateCharCount() {
    const count = elements.moodInput.value.length;
    elements.charCount.textContent = count;
}

// ===========================
// Event Listeners
// ===========================

// Tab switching
elements.tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        switchTab(tab.dataset.tab);
    });
});

// Input character counter
elements.moodInput.addEventListener('input', updateCharCount);

// Generate button
elements.generateBtn.addEventListener('click', handleGenerate);

// Enter key to generate
elements.moodInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleGenerate();
    }
});

// Retry button
elements.retryBtn.addEventListener('click', handleRetry);

// ===========================
// Initialization
// ===========================

function init() {
    // Load initial data
    loadHistory();

    // Focus input
    elements.moodInput.focus();

    console.log('Emogen extension initialized');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
