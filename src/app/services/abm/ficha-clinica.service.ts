import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';
import { SeguridadService } from '../seguridad.service';

const seguridad = new SeguridadService();

@Injectable({
    providedIn: 'root'
})
export class FichaClinicaService extends BaseService {
    url = `${environment.host}/fichaClinica`;
    creadoMsg = 'Ficha creada';
    eliminadoMsg = 'Ficha eliminada';
    editadoMsg = 'Ficha editada';
    deleteFields = ['empleado', 'empleado_nombre', 'cliente', 'cliente_nombre', 'categoria', 'categoria_nombre',
        'subcategoria', 'subcategoria_nombre', 'fechaHoraCadena'];
    headers: any = {
        usuario: this.seguridadService.getCurrentUser()?.usuarioLogin
    }
}
