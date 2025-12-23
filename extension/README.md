# Emogen Chrome Extension

AI-powered emoji generator extension for Chrome. Generate perfect emojis based on your mood or vibe, right from your browser toolbar.

## Features

✨ **AI-Powered Generation** - Uses OpenAI's GPT-4o-mini to generate contextually perfect emojis  
🎨 **Beautiful UI** - Glassmorphism design with smooth animations  
📜 **History Tracking** - Automatically saves your recent emoji generations  
⭐ **Favorites** - Star and save your favorite emoji sets  
📋 **One-Click Copy** - Click any emoji to instantly copy to clipboard  
🌙 **Dark Theme** - Easy on the eyes with a premium dark design

## Installation (Development)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the `extension` folder
6. The Emogen icon should appear in your toolbar

## Configuration

Before using the extension, you need to configure the API endpoint:

1. Open `popup/popup.js`
2. Update the `CONFIG.API_ENDPOINT` with your deployed Genkit API URL:
   ```javascript
   const CONFIG = {
     API_ENDPOINT: 'https://your-deployed-api.com/api/emojiFlow',
     // ...
   };
   ```

### Deploying the Genkit API

The extension requires a publicly accessible API endpoint. You have several options:

#### Option 1: Firebase Functions (Recommended)
```bash
# From the main emogen directory
npm run deploy:functions
```

Your API will be available at:
```
https://us-central1-[your-project-id].cloudfunctions.net/api/emojiFlow
```

#### Option 2: Vercel/Railway/Fly.io

Deploy the `genkit/server.ts` file as a standalone Node.js application.

**Important:** Make sure to configure CORS to allow `chrome-extension://*` origins:

```javascript
// In your server configuration
const allowedOrigins = [
  'chrome-extension://*',
  'https://your-domain.com'
];
```

## Usage

1. **Click the extension icon** in your Chrome toolbar
2. **Enter your mood or vibe** in the text field (e.g., "excited about new project", "feeling cozy", "ready for adventure")
3. **Click "Generate Emojis"** and wait for the AI to create your perfect emoji set
4. **Click any emoji** to copy it to your clipboard
5. **Star favorites** by clicking the star icon on any emoji set
6. **Browse history** to see your recent generations

## Keyboard Shortcuts

- `Enter` - Generate emojis (when focused on input)
- `Shift + Enter` - Add new line in input

## Structure

```
extension/
├── manifest.json          # Chrome extension configuration
├── popup/
│   ├── popup.html        # Main popup UI
│   ├── popup.css         # Styles (glassmorphism theme)
│   └── popup.js          # Core logic and API integration
├── icons/
│   ├── icon16.png        # Toolbar icon (16x16)
│   ├── icon48.png        # Extension manager icon (48x48)
│   └── icon128.png       # Chrome Web Store icon (128x128)
└── README.md             # This file
```

## Privacy

This extension:
- ✅ Stores emoji history and favorites locally using Chrome's `storage.local` API
- ✅ Only sends your prompts to the configured API endpoint
- ✅ Does not collect, transmit, or sell any personal data
- ✅ Works entirely client-side (except for AI generation)

## Permissions

- `storage` - To save your history and favorites locally
- `host_permissions` - To communicate with the Genkit API endpoint

## Known Limitations

- Maximum 200 characters per prompt
- Stores up to 50 history items
- Stores up to 100 favorites
- Requires active internet connection

## Future Roadmap

- [ ] Right-click context menu integration
- [ ] Keyboard shortcut for quick access
- [ ] Custom API endpoint configuration UI
- [ ] Export/import favorites
- [ ] Multiple emoji set sizes (more than 3)
- [ ] Emoji preview on hover
- [ ] Dark/light theme toggle

## Support

For issues or feature requests, please visit the [main Emogen repository](https://github.com/yourusername/emogen).

## License

MIT License - Same as the main Emogen project

---

Made with ✨ by the Emogen team
