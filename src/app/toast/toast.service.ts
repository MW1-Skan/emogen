import { Injectable, effect, signal } from '@angular/core';

export type ToastType = 'success' | 'info' | 'error';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  createdAt: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSignal = signal<ToastMessage[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();

  constructor() {
    effect(() => {
      const now = Date.now();
      const active = this.toastsSignal().filter((toast) => now - toast.createdAt < toast.duration);
      if (active.length !== this.toastsSignal().length) {
        queueMicrotask(() => this.toastsSignal.set(active));
      }
    });
  }

  success(message: string, duration = 2800): void {
    this.enqueue(message, 'success', duration);
  }

  info(message: string, duration = 2800): void {
    this.enqueue(message, 'info', duration);
  }

  error(message: string, duration = 3200): void {
    this.enqueue(message, 'error', duration);
  }

  dismiss(id: string): void {
    this.toastsSignal.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  private enqueue(message: string, type: ToastType, duration: number): void {
    const id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const toast: ToastMessage = {
      id,
      message,
      type,
      duration,
      createdAt: Date.now()
    };

    this.toastsSignal.update((toasts) => [...toasts, toast]);

    setTimeout(() => this.dismiss(id), duration);
  }
}
