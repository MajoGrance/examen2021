import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';
import { SeguridadService } from '../seguridad.service';

const seguridad = new SeguridadService();

@Injectable({
    providedIn: 'root'
})
export class HorarioAgendaService extends BaseService {
    url = `${environment.host}/personaHorarioAgenda`;
    creadoMsg = 'Horario agendado creado';
    eliminadoMsg = 'Horario agendado eliminado';
    editadoMsg = 'Horario agendado editado';
    deleteFields = ['empleado_id', 'empleado_nombre'];
    headers = {
        usuario: this.seguridadService.getCurrentUser()?.usuarioLogin
    }
}
