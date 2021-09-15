import { RecordModel } from './base.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUsuario } from './usuario.model';

const fb = new FormBuilder();

export interface IHorarioExcepcion {
    fechaCadena:         string,
    horaAperturaCadena:  string,
    horaCierreCadena:    string,
    flagEsHabilitar:     boolean,
    idEmpleado:          IUsuario,
    intervaloMinutos:    number,
}

export class HorarioExcepcionModel extends RecordModel implements IHorarioExcepcion {
    fechaCadena!:        string;
    horaAperturaCadena!: string;
    horaCierreCadena!:   string;
    flagEsHabilitar!:    boolean;
    idEmpleado!:         IUsuario;
    intervaloMinutos!:   number;

    constructor() {
        super();
    }

    serialize(): IHorarioExcepcion {
        return super.serialize();
    }

    getFormGroup(): FormGroup {
        return fb.group({
            fechaCadena: [this.fechaCadena],
            horaAperturaCadena: [this.horaAperturaCadena, Validators.required],
            horaCierreCadena: [this.horaCierreCadena, Validators.required],
            flagEsHabilitar: [this.flagEsHabilitar, Validators.required],
            idEmpleado: [this.idEmpleado, Validators.required],
            intervaloMinutos: [this.intervaloMinutos, Validators.required],
        });
    }

    copy(object: IHorarioExcepcion): HorarioExcepcionModel {
        this.fechaCadena = object.fechaCadena;
        this.horaAperturaCadena = object.horaAperturaCadena;
        this.horaCierreCadena = object.horaCierreCadena;
        this.intervaloMinutos = object.intervaloMinutos;
        this.idEmpleado = object.idEmpleado;
        return this;
    }

}