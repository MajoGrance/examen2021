import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';
import { SeguridadService } from '../seguridad.service';

const seguridad = new SeguridadService();

@Injectable({
    providedIn: 'root'
})
export class ReservaService extends BaseService {
    url = `${environment.host}/reserva`;
    creadoMsg = 'Reserva creada';
    eliminadoMsg = 'Reserva eliminada';
    editadoMsg = 'Reserva editada';
    deleteFields = ['empleado', 'empleado_nombre', 'cliente', 'cliente_nombre'];
    headers: any = {
        usuario: this.seguridadService.getCurrentUser()?.usuarioLogin
    }
}
