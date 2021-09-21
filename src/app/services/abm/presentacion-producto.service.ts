import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';

@Injectable({
    providedIn: 'root'
})
export class PresentacionProductoService extends BaseService {
    url = `${environment.host}/presentacionProducto`;
    creadoMsg = 'Presentación creada';
    eliminadoMsg = 'Presentación eliminada';
    editadoMsg = 'Presentación editada';
    deleteFields = ['producto_id', 'producto_desc'];
}
