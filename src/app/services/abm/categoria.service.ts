import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';

@Injectable({
    providedIn: 'root'
})
export class CategoriaService extends BaseService {
    url = `${environment.host}/categoria`;
    creadoMsg = 'Categoría creada';
    eliminadoMsg = 'Categoría eliminada';
    editadoMsg = 'Categoría editada'
}
