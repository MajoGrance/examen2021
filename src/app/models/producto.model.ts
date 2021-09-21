import { RecordModel } from './base.model';
import { FormBuilder } from '@angular/forms';
import { ITipoProducto } from './tipo-producto';
import { IMarca } from './marca.model';
import { PasteItemInterface } from '../shared/interfaces';
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

    getPasteItems(objects: IProducto[]): PasteItemInterface[] {
        const items: PasteItemInterface[] = [];
        for (const obj of objects) {
            const item: PasteItemInterface = {
                id: obj.idProducto,
                nombre: `${obj.idProducto} - ${obj.descripcionGeneral}`,
                descripcion: [
                    {icono: 'category', texto: `Categoría: ${obj.idTipoProducto?.idCategoria?.idCategoria} - ${obj.idTipoProducto?.idCategoria?.descripcion}`},
                    {icono: 'label', texto: `Sub categoría: ${obj.idTipoProducto?.idTipoProducto} - ${obj.idTipoProducto?.descripcion}`}
                ],
            }
            items.push(item);
        }
        return items;
    }
}