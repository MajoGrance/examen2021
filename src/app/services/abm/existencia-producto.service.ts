import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';

@Injectable({
    providedIn: 'root'
})
export class ExistenciaProductoService extends BaseService {
    url = `${environment.host}/existenciaProducto`;
    headers: any = {
        usuario: this.seguridadService.getCurrentUser()?.usuarioLogin
    }
}
