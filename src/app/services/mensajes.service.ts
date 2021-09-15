import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
    providedIn: 'any'
})
export class MensajesService {
    constructor(
        private confirmationService: ConfirmationService
    ) { }

    descartarCambios(): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            this.confirmationService.confirm({
                header: '¿Desea descartar los cambios?',
                message: 'Si confirma se perderán los cambios realizados.',
                accept: () => { resolve(true); },
                reject: () => { resolve(false); },
                rejectButtonStyleClass: 'p-button-text p-button-danger',
                acceptButtonStyleClass: 'p-button-text',
                rejectLabel: 'Cancelar',
                acceptLabel: 'Confirmar',
                closeOnEscape: true,
                dismissableMask: true
            });
        });
    }


    eliminarRegistros(objs: any[]): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            if (objs.length > 0) {
                if (objs.length === 1) {
                    this.confirmationService.confirm({
                        header: `¿Desea eliminar ${objs.length} registro?`,
                        message: 'Si confirma no se podrá revertir el cambio.',
                        accept: () => { resolve(true); },
                        reject: () => { resolve(false); },
                        rejectButtonStyleClass: 'p-button-text p-button-danger',
                        acceptButtonStyleClass: 'p-button-text',
                        rejectLabel: 'Cancelar',
                        acceptLabel: 'Confirmar',
                        closeOnEscape: true,
                        dismissableMask: true
                    });
                } else {
                    this.confirmationService.confirm({
                        header: `¿Desea eliminar ${objs.length} registros?`,
                        message: 'Si confirma no se podrá revertir el cambio.',
                        accept: () => { resolve(true); },
                        reject: () => { resolve(false); },
                        rejectButtonStyleClass: 'p-button-text p-button-danger',
                        acceptButtonStyleClass: 'p-button-text',
                        rejectLabel: 'Cancelar',
                        acceptLabel: 'Confirmar',
                        closeOnEscape: true,
                        dismissableMask: true
                    });
                }
            } else {
                resolve(false);
            }
        });
    }
}
