import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';
import { SeguridadService } from '../seguridad.service';

const seguridad = new SeguridadService();

@Injectable({
    providedIn: 'root'
})
export class HorarioExcepcionService extends BaseService {
    url = `${environment.host}/horarioExcepcion`;
    creadoMsg = 'Horario excepción creado';
    eliminadoMsg = 'Horario excepción eliminado';
    editadoMsg = 'Horario excepción editado';
    deleteFields = ['empleado_id', 'empleado_nombre'];
    headers = {
        usuario: this.seguridadService.getCurrentUser()?.usuarioLogin
    }
}
