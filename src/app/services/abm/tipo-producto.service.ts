import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';

@Injectable({
    providedIn: 'root'
})
export class TipoProductoService extends BaseService {
    url = `${environment.host}/tipoProducto`;
    creadoMsg = 'Sub categoría creada';
    eliminadoMsg = 'Sub categoría eliminada';
    editadoMsg = 'Sub categoría editada';
    deleteFields = ['categoria_id', 'categoria_desc'];
}
