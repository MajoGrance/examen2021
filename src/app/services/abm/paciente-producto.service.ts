import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';

@Injectable({
    providedIn: 'root'
})
export class PacienteService extends BaseService {
    url = `${environment.host}/persona`;
    creadoMsg = 'Paciente creado';
    eliminadoMsg = 'Paciente eliminado';
    editadoMsg = 'Paciente editado';
}
