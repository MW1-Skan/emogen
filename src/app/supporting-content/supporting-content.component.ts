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
            class="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-xl font-semibold text-white"
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
                Why creators pick Emogen
              </p>
              <h2 class="text-3xl font-semibold tracking-tight text-white">
                Spin up AI emoji mood boards in seconds
              </h2>
              <p class="text-white/75 text-base leading-relaxed">
                Emogen pairs OpenAI-powered prompts with a tactile workspace so you can ideate emoji
                reactions for Discord, Slack, livestream chats, newsletters, or your next launch update.
                Every result is saved to history, favorites sync locally, and copying to clipboard is a
                single click.
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
                <h3 class="text-2xl font-semibold text-white">Emoji generator questions</h3>
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
            class="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-xl font-semibold text-white"
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
                Link-friendly assets for blog posts & roundups
              </h3>
              <p class="text-white/75 text-base">
                Help other makers discover Emogen by embedding these pre-approved assets, blurbs, and
                collaboration ideas. Use them freely in AI tool directories, newsletters, or comparison
                pieces.
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
              ><code>Emogen is a free AI emoji generator that turns any prompt into a three-emoji mood board. Save history, favorite sets, and copy each emoji for Discord, Slack, or social replies in one click at https://emo-gen.org.</code></pre>
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
      title: 'AI emoji generator',
      description: 'Craft vivid moods from any prompt and let Genkit + OpenAI deliver three spot-on emoji responses.'
    },
    {
      title: 'Discord & Slack ready',
      description: 'Copy individual emojis or save sets you love to reuse across community platforms.'
    },
    {
      title: 'History + favorites',
      description: 'LocalStorage keeps your best emoji boards handy while preventing duplicates and overflow.'
    },
    {
      title: 'Micro-interactions',
      description: 'Toasts, regen states, and floating background give you playful feedback without slowing flow.'
    }
  ];

  protected readonly faqs: Faq[] = [
    {
      question: 'Is Emogen free to use?',
      answer:
        'Yes. The current Genkit flow is free for makers during the MVP. We may add optional donations or premium packs later, but generating, favoriting, and copying emojis costs nothing.'
    },
    {
      question: 'Can I generate emojis for Discord or Slack?',
      answer:
        'Absolutely. Prompts that mention Discord channels, Slack threads, or brand tone help the AI select expressive emoji sets you can copy into those tools instantly.'
    },
    {
      question: 'Do you store my prompts or emoji history?',
      answer:
        'Emoji sets stay in your browser via localStorage so you alone see your history and favorites. Prompts are only sent to our Genkit/OpenAI flow to create the emojis.'
    },
    {
      question: 'How can I get updates or suggest features?',
      answer:
        'Follow the donate link to say hi, or watch our release notes on emo-gen.org. We plan newsletters and a public roadmap once hosting and flows settle.'
    }
  ];

  protected readonly resources: Resource[] = [
    {
      title: 'Media kit (logos + gradients)',
      description:
        'Download PNG/SVG assets sized for hero images, blog headers, and AI tool directories.',
      action: { label: 'Download pack', href: 'emogen-favicon.png' }
    },
    {
      title: 'Product spec & storyline',
      description:
        'Reference our public spec to highlight the AI flow, localStorage history, and tactile UX touches.',
      action: { label: 'View spec', href: 'press-notes.html' }
    },
    {
      title: 'Collab & interview pitches',
      description:
        'Pitch emoji challenges, feature requests, or newsletter swaps. We reply quickly to thoughtful outreach.',
      action: { label: 'Email Emogen', href: 'mailto:skandersayadi7@gmail.com?subject=Emogen%20feature' }
    }
  ];
}
