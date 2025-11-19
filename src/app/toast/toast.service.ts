import { Injectable, signal } from '@angular/core';

type ToastSeverity = 'success' | 'info' | 'error';

export type ToastMessage = {
  id: string;
  severity: ToastSeverity;
  detail: string;
  exiting: boolean;
};

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSignal = signal<ToastMessage[]>([]);

  readonly toasts = this.toastsSignal.asReadonly();

  success(detail: string, life = 2600): void {
    this.add('success', detail, life);
  }

  info(detail: string, life = 2600): void {
    this.add('info', detail, life);
  }

  error(detail: string, life = 3400): void {
    this.add('error', detail, life);
  }

  clear(): void {
    this.toastsSignal.set([]);
  }

  remove(id: string): void {
    this.startExit(id);
  }

  private add(severity: ToastSeverity, detail: string, life: number): void {
    const id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const next: ToastMessage = { id, severity, detail, exiting: false };
    this.toastsSignal.update((toasts) => [next, ...toasts]);

    setTimeout(() => this.startExit(id), life);
  }

  private startExit(id: string): void {
    let found = false;
    this.toastsSignal.update((toasts) =>
      toasts.map((toast) => {
        if (toast.id !== id) {
          return toast;
        }
        found = true;
        if (toast.exiting) {
          return toast;
        }
        return { ...toast, exiting: true };
      })
    );

    if (!found) {
      return;
    }

    setTimeout(() => this.finalizeRemoval(id), 220);
  }

  private finalizeRemoval(id: string): void {
    this.toastsSignal.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }
}
