import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

type ToastSeverity = 'success' | 'info' | 'error';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly messageService = inject(MessageService);

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
    this.messageService.clear();
  }

  private add(severity: ToastSeverity, detail: string, life: number): void {
    this.messageService.add({
      severity,
      detail,
      life,
      closable: false,
      styleClass: `emogen-toast-${severity}`
    });
  }
}
