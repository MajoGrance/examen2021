import { RecordModel } from './base.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableColumn } from '../shared/interfaces';

const fb = new FormBuilder();

export interface ICategoria {
    idCategoria:    number,
    descripcion:    string,
}

export class CategoriaModel extends RecordModel implements ICategoria{
    idCategoria!:   number;
    descripcion!:   string;

    constructor() {
        super();
    }

    getId(): number {
        return this.idCategoria;
    }

    setId(id: number): void {
        this.idCategoria = id;
    }

    serialize(): ICategoria {
        return super.serialize();
    }

    getFormGroup(): FormGroup {
        return fb.group({
            idCategoria: [this.idCategoria],
            descripcion: [this.descripcion, Validators.required],
        });
    }

    copy(object: ICategoria): CategoriaModel {
        this.descripcion = object.descripcion;
        return this;
    }

    getPasteColumns(): TableColumn[] {
        return [
            { header: 'ID', type: 'id', field: 'idCategoria', filterType: 'numeric' },
            { header: 'Descripción', type: 'text', field: 'descripcion', filterType: 'text' },
        ]
    }
}