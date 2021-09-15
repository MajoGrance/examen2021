import { RecordModel } from './base.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProducto } from './producto.model';

const fb = new FormBuilder();

export interface IPresentacionProducto {
    idPresentacionProducto:    number,
    nombre:                    string,
    descripcion:               string,
    idProducto:                IProducto
}

export class PresentacionProductoModel extends RecordModel implements IPresentacionProducto {
    idPresentacionProducto!:   number;
    nombre!:                   string;
    descripcion!:              string;
    idProducto!:               IProducto;

    constructor() {
        super();
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
            id: [this.idPresentacionProducto],
            nombre: [this.nombre, Validators.required],
            descripcion: [this.descripcion, Validators.required],
            idProducto: [this.idProducto, Validators.required],
        });
    }

    copy(object: IPresentacionProducto): IPresentacionProducto {
        this.descripcion = object.descripcion;
        this.nombre = object.nombre;
        this.idProducto = object.idProducto;
        return this;
    }

}