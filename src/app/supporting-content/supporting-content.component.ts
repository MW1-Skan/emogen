import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type Highlight = { title: string; description: string };
type Faq = { question: string; answer: string };
type Resource = { title: string; description: string; action?: { label: string; href: string } };

@Component({
  selector: 'app-supporting-content',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative z-10 w-full'
  },
  template: `
    <div class="space-y-8">
      <section
        class="mx-auto mt-10 w-full max-w-6xl rounded-[var(--radius-xl)] border border-white/5 bg-white/5 px-4 py-10 text-white shadow-2xl backdrop-blur-2xl sm:px-6 lg:px-10"
        aria-labelledby="emogen-faq-heading"
      >
        <details class="group" data-accordion="faq">
          <summary
            class="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 text-left text-xl font-semibold text-white"
          >
            <span id="emogen-faq-heading">FAQ & highlights</span>
            <span
              aria-hidden="true"
              class="rounded-full border border-white/20 px-2 py-1 text-sm text-white/70 transition group-open:rotate-45"
              >+</span
            >
          </summary>

          <div class="mt-8 flex flex-col gap-10 lg:flex-row">
            <div class="flex-1 space-y-5">
            <p class="text-sm uppercase tracking-[0.35em] text-white/60">
              Why emoji hunters choose Emogen
            </p>
            <h2 class="text-3xl font-semibold tracking-tight text-white">
              Turn any word, feeling, or expression into instant emoji options
            </h2>
            <p class="text-white/75 text-base leading-relaxed">
              OS emoji pickers rely on short keywords and rarely understand phrases. Emogen lets you
              type whatever is on your mind—"analysis", "danger", or "I am in love"—and returns a trio of
              creative emojis you can copy, favorite, or reuse without scrolling endless grids.
            </p>
              <ul class="grid gap-5 md:grid-cols-2">
                @for (highlight of highlights; track $index) {
                  <li class="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p class="font-semibold text-white">{{ highlight.title }}</p>
                    <p class="mt-2 text-sm text-white/70">
                      {{ highlight.description }}
                    </p>
                  </li>
                }
              </ul>
            </div>

            <div class="flex-1 space-y-4">
              <div>
                <p class="text-sm uppercase tracking-[0.35em] text-white/60">FAQ</p>
                <h3 class="text-2xl font-semibold text-white">Emoji finder questions</h3>
              </div>
              <div class="space-y-3">
                @for (faq of faqs; track faq.question) {
                  <details
                    class="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/30"
                  >
                    <summary
                      class="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold text-white"
                    >
                      <span>{{ faq.question }}</span>
                      <span
                        aria-hidden="true"
                        class="text-sm text-white/70 transition group-open:rotate-45"
                        >+</span
                      >
                    </summary>
                    <p class="mt-3 text-sm leading-relaxed text-white/75">
                      {{ faq.answer }}
                    </p>
                  </details>
                }
              </div>
            </div>
          </div>
        </details>
      </section>

      <section
        class="mx-auto w-full max-w-6xl rounded-[var(--radius-xl)] border border-white/5 bg-white/5 px-4 py-8 text-white shadow-2xl backdrop-blur-2xl sm:px-6 lg:px-10"
        aria-labelledby="emogen-press-heading"
      >
        <details class="group" data-accordion="press">
          <summary
            class="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 text-left text-xl font-semibold text-white"
          >
            <span id="emogen-press-heading">Press notes & assets</span>
            <span
              aria-hidden="true"
              class="rounded-full border border-white/20 px-2 py-1 text-sm text-white/70 transition group-open:rotate-45"
              >+</span
            >
          </summary>

          <div class="space-y-6 pt-6">
            <div class="space-y-3">
              <p class="text-sm uppercase tracking-[0.35em] text-white/60">Press & resources</p>
              <h3 class="text-2xl font-semibold text-white">
                Link-friendly assets for emoji finder roundups
              </h3>
              <p class="text-white/75 text-base">
                Help people who crave flexible emoji search discover Emogen by embedding these blurbs
                and assets in tool roundups, newsletters, or creator showcases.
              </p>
            </div>

            <div class="grid gap-4 md:grid-cols-3">
              @for (resource of resources; track resource.title) {
                <article class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h4 class="text-lg font-semibold text-white">{{ resource.title }}</h4>
                  <p class="mt-2 text-sm text-white/70">
                    {{ resource.description }}
                  </p>
                  @if (resource.action) {
                    <a
                      class="mt-4 inline-flex items-center justify-center rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/60"
                      [href]="resource.action.href"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {{ resource.action.label }}
                    </a>
                  }
                </article>
              }
            </div>

            <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p class="text-sm uppercase tracking-[0.25em] text-white/60">Ready-made blurb</p>
              <p class="mt-2 text-white/80">
                Paste this snippet into your directory or roundup to describe Emogen accurately:
              </p>
              <pre
                class="mt-3 overflow-auto rounded-[var(--radius-lg)] bg-black/50 p-4 text-sm text-white/90"
              ><code>Emogen is a free AI emoji finder built for anyone frustrated by rigid native pickers. Type any word, feeling, or expression and get three accurate emoji suggestions you can copy, favorite, or revisit later at https://emo-gen.org.</code></pre>
            </div>
          </div>
        </details>
      </section>
    </div>
  `
})
export class SupportingContentComponent {
  protected readonly highlights: Highlight[] = [
    {
      title: 'Emoji lookup without scrolling',
      description: 'Type "analysis", "math", or "what is that??" and get three curated emojis without digging through static OS pickers.'
    },
    {
      title: 'Laptop-friendly workflow',
      description: 'Launch Emogen in any browser and copy results straight into Slack, Docs, Notion, or streams—ideal when shortcuts are clunky or missing.'
    },
    {
      title: 'History + favorites',
      description: 'LocalStorage keeps your best emoji sets handy, prevents duplicates, and lets you pin the ones you reuse often.'
    },
    {
      title: 'Context-aware AI',
      description: 'A tuned Genkit + OpenAI flow understands feelings and full expressions so suggestions feel natural and creative.'
    }
  ];

  protected readonly faqs: Faq[] = [
    {
      question: 'Why not just use the native emoji picker?',
      answer:
        'Built-in pickers depend on simple keywords and often ignore phrases like "I am in love." Emogen gives you focused, AI-curated suggestions from any browser tab so you can copy emojis without digging through rigid grids.'
    },
    {
      question: 'What kind of prompts work best?',
      answer:
        'Single words, phrases, feelings, or full sentences all work—try "analysis", "sportsmanship", "danger", or "I am in love". Emogen interprets context clues to propose three matching emojis.'
    },
    {
      question: 'Do you store my prompts or emoji history?',
      answer:
        'Emoji sets stay in your browser via localStorage, so only you can see your history and favorites. Prompts are sent to the Genkit/OpenAI flow just long enough to generate suggestions.'
    },
    {
      question: 'How do I reuse a set I like?',
      answer:
        'Every result lands in history and you can favorite any trio to keep it pinned. Copy emojis individually or tap a favorite to bring it back into focus for another copy or tweak.'
    }
  ];

  protected readonly resources: Resource[] = [
    {
      title: 'Media kit (logos + gradients)',
      description: 'Download PNG/SVG assets featuring the emoji finder UI for hero images or tool directories.',
      action: { label: 'Download pack', href: 'emogen-favicon-square.png' }
    },
    {
      title: 'Product spec & storyline',
      description: 'Highlight how Emogen solves laptop emoji search gaps and how history/favorites keep teams fast.',
      action: { label: 'View spec', href: 'press-notes.html' }
    },
    {
      title: 'Collab & interview pitches',
      description: 'Pitch emoji challenges, productivity angles, or newsletter swaps. We reply quickly to thoughtful outreach.',
      action: { label: 'Email Emogen', href: 'mailto:skandersayadi7@gmail.com?subject=Emogen%20feature' }
    }
  ];
}
