import { RecordModel } from './base.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableColumn, PasteItemInterface } from '../shared/interfaces';

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

    getPasteItems(objects: ICategoria[]): PasteItemInterface[] {
        const items: PasteItemInterface[] = [];
        for (const obj of objects) {
            const item: PasteItemInterface = {
                id: obj.idCategoria,
                nombre: `${obj.idCategoria} - ${obj.descripcion}`,
            }
            items.push(item);
        }
        return items;
    }
}