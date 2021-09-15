import { RecordModel } from './base.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategoria } from './categoria.model';
import { TableColumn } from '../shared/interfaces';

const fb = new FormBuilder();

export interface ITipoProducto {
    idTipoProducto:   number,
    descripcion:      string,
    idCategoria:      ICategoria
}

export class TipoProductoModel extends RecordModel implements ITipoProducto {
    idTipoProducto!:  number;
    descripcion!:     string;
    idCategoria!:     ICategoria

    constructor() {
        super();
    }

    getId(): number {
        return this.idTipoProducto;
    }

    setId(id: number): void {
        this.idTipoProducto = id;
    }

    serialize(): ITipoProducto {
        return super.serialize();
    }

    getFormGroup(): FormGroup {
        return fb.group({
            idTipoProducto: [this.idTipoProducto],
            descripcion: [this.descripcion, Validators.required],
            idCategoria: [this.idCategoria, Validators.required],
            categoria_id: [this.idCategoria?.idCategoria, Validators.required],
            categoria_desc: [this.idCategoria?.descripcion],
        });
    }

    copy(object: ITipoProducto): TipoProductoModel {
        this.descripcion = object.descripcion;
        this.idCategoria = object.idCategoria;
        return this;
    }

}