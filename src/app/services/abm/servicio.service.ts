import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';
import { SeguridadService } from '../seguridad.service';

const seguridad = new SeguridadService();

@Injectable({
    providedIn: 'root'
})
export class ServicioService extends BaseService {
    url = `${environment.host}/servicio`;
    creadoMsg = 'Servicio creado';
    eliminadoMsg = 'Servicio eliminado';
    editadoMsg = 'Servicio editado';
    deleteFields = ['empleado', 'empleado_nombre', 'cliente', 'cliente_nombre', 'categoria_id', 'categoria_nombre',
        'subcategoria_id', 'subcategoria_nombre', 'ficha_clinica'];
    headers: any = {
        usuario: this.seguridadService.getCurrentUser()?.usuarioLogin
    }
}
