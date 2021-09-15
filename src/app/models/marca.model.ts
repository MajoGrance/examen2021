import { RecordModel } from './base.model';
import { FormBuilder } from '@angular/forms';
const fb = new FormBuilder();

export interface IMarca {
    idMarca:      number;
    descripcion:  string;
    observacion:  string;
}

export class MarcaModel extends RecordModel implements IMarca {
    idMarca!:     number;
    descripcion!: string;
    observacion!: string;

    serialize(): IMarca {
        return super.serialize();
    }
}