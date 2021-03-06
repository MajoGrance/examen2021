import { RecordModel } from './base.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProducto } from './producto.model';
import { PasteItemInterface } from '../shared/interfaces';

const fb = new FormBuilder();

export interface IExistenciaProducto {
    precioVenta:               number;
}

export interface IPresentacionProducto {
    idPresentacionProducto:    number,
    nombre:                    string,
    codigo:                    string,
    descripcion:               string,
    flagServicio:              string,
    idProducto:                IProducto
    existenciaProducto:        IExistenciaProducto
}

export class PresentacionProductoModel extends RecordModel implements IPresentacionProducto {
    idPresentacionProducto!:   number;
    nombre!:                   string;
    codigo!:                   string;
    descripcion!:              string;
    flagServicio!:             string;
    idProducto!:               IProducto;
    existenciaProducto!:       IExistenciaProducto;

    constructor() {
        super();
        this.flagServicio = "S";
    }

    getId(): number {
        return this.idPresentacionProducto;
    }

    setId(id: number): void {
        this.idPresentacionProducto = id;
    }

    serialize(): IProducto {
        return super.serialize();
    }

    getFormGroup(): FormGroup {
        return fb.group({
            idPresentacionProducto: [this.idPresentacionProducto],
            codigo: [this.codigo, Validators.required],
            descripcion: [this.codigo],
            flagServicio: [this.flagServicio],
            idProducto: [this.idProducto, Validators.required],
            nombre: [this.nombre, Validators.required],
            producto_id: [this.idProducto?.idProducto, Validators.required],
            producto_desc: [this.idProducto?.descripcionGeneral],
            existenciaProducto: [this.existenciaProducto]
        });
    }

    copy(object: IPresentacionProducto): IPresentacionProducto {
        this.descripcion = object.descripcion;
        this.nombre = object.nombre;
        this.idProducto = object.idProducto;
        this.flagServicio = object.flagServicio;
        return this;
    }

    getPasteItems(objects: IPresentacionProducto[]): PasteItemInterface[] {
        const items: PasteItemInterface[] = [];
        for (const obj of objects) {
            const item: PasteItemInterface = {
                id: obj.idPresentacionProducto,
                nombre: `${obj.idPresentacionProducto} - ${obj.nombre}`,
                descripcion: [
                    {icono: 'category', texto: `Categoria: ${obj.idProducto?.idTipoProducto?.idCategoria?.descripcion}`},
                    {icono: 'label', texto: `Sub categor??a: ${obj.idProducto?.idTipoProducto?.descripcion}`}
                ]
            }
            items.push(item);
        }
        return items;
    }

}