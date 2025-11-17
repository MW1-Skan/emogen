import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-emoji-input',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'glass-panel rounded-[var(--radius-xl)] p-8 md:p-10 text-white/90 shadow-emoji-card backdrop-blur-3xl'
  },
  template: `
    <form
      class="flex flex-col gap-6"
      aria-label="Emoji generation form"
      (ngSubmit)="handleSubmit()"
      [formGroup]="form"
    >
      <div class="flex flex-col gap-2">
        <p class="text-sm uppercase tracking-[0.35em] text-white/60">Emogen</p>
        <h1 class="text-3xl md:text-5xl font-semibold text-white tracking-tight">
          AI emoji generator for every vibe
        </h1>
        <p class="text-white/70 text-base max-w-2xl">
          Describe your feeling, launch, or community moment and Emogen's AI emoji maker responds with
          three expressive icons you can remix, favorite, and copy instantly.
        </p>
      </div>

      <label class="flex flex-col gap-3">
        <span class="sr-only">Tell us your vibe</span>
        <div
          class="flex flex-col gap-4 rounded-[var(--radius-lg)] bg-white/5 p-3 ring-1 ring-white/10 focus-within:ring-accent"
        >
          <textarea
            formControlName="prompt"
            class="w-full resize-none bg-transparent text-lg text-white placeholder:text-white/40 focus-visible:outline-none"
            rows="3"
            maxlength="180"
            placeholder="Just aced my presentation and I'm buzzing with ideas..."
            aria-describedby="prompt-hint"
          ></textarea>
          <div class="flex items-center justify-between text-sm text-white/60">
            <span id="prompt-hint">Max 180 characters &mdash; be specific</span>
            <span>{{ charactersRemaining() }} left</span>
          </div>
        </div>
      </label>

      <div class="flex flex-wrap gap-4">
        <button
          type="submit"
          class="rounded-full bg-primary px-6 py-3 text-base font-semibold text-background transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-primary/90"
          [disabled]="isGenerating() || form.invalid"
        >
          @if (isGenerating()) {
            <span>Summoning emojis...</span>
          } @else {
            <span>Generate emojis</span>
          }
        </button>
        <button
          type="reset"
          class="rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
          (click)="handleReset()"
        >
          Clear
        </button>
        <button
          type="button"
          class="ml-auto flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white/80 ring-1 ring-white/15 transition hover:bg-white/20 hover:text-white"
          (click)="handleDonate()"
        >
          <span class="pi pi-heart text-pink-300"></span>
          Donate
        </button>
      </div>
    </form>
  `
})
export class EmojiInputComponent {
  readonly isGenerating = input(false);
  readonly initialPrompt = input('');
  readonly submitted = output<string>();
  readonly cleared = output<void>();
  readonly donate = output<void>();

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    prompt: ['', [Validators.required, Validators.maxLength(180)]]
  });

  constructor() {
    effect(() => {
      const value = this.initialPrompt();
      if (!value) {
        return;
      }

      const control = this.form.controls.prompt;
      if (!control.dirty) {
        control.setValue(value);
      }
    });
  }

  protected handleSubmit(): void {
    if (this.form.invalid || this.isGenerating()) {
      return;
    }

    this.submitted.emit(this.form.controls.prompt.value.trim());
  }

  protected handleReset(): void {
    this.form.reset({ prompt: '' });
    this.cleared.emit();
  }

  protected charactersRemaining(): number {
    return 180 - (this.form.controls.prompt.value?.length ?? 0);
  }

  protected handleDonate(): void {
    this.donate.emit();
  }
}
