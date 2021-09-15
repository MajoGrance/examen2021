import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'any'
})
export class ToastService {
    constructor(private messageService: MessageService) { }

    show(
        position: 'top-right',
        type: 'success' | 'error' | 'info' | 'warning',
        title: string, comment: string
    ): void {
        this.messageService.add({
            key: position,
            severity: type,
            summary: title,
            life: 7000,
            detail: comment,
        });
    }
}
