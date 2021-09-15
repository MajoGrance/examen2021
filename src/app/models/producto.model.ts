import { RecordModel } from './base.model';
import { FormBuilder } from '@angular/forms';
import { ITipoProducto } from './tipo-producto';
import { IMarca } from './marca.model';
const fb = new FormBuilder();

export interface IProducto {
    idProducto:          number;
    descripcion:         null;
    idTipoProducto:      ITipoProducto;
    idModelo:            null;
    idMarca:             IMarca;
    anho:                null;
    observacion:         null;
    edadSexo:            null;
    descripcionGeneral:  string;
    edadSexoNulo:        null;
}

export class ProductoModel extends RecordModel implements IProducto{
    idProducto!:         number;
    descripcion!:        null;
    idTipoProducto!:     ITipoProducto;
    idModelo!:           null;
    idMarca!:            IMarca;
    anho!:               null;
    observacion!:        null;
    edadSexo!:           null;
    descripcionGeneral!: string;
    edadSexoNulo!:       null;

    serialize(): IProducto {
        return super.serialize();
    }
}