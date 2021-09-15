import { RecordModel } from './base.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUsuario } from './usuario.model';

const fb = new FormBuilder();

export interface IHorarioAgenda {
    dia:                 number,
    horaAperturaCadena:  string,
    horaCierreCadena:    string,
    intervaloMinutos:    string,
    idEmpleado:          IUsuario,
}

export class HorarioAgendaModel extends RecordModel implements IHorarioAgenda{
    dia!:                number;
    horaAperturaCadena!: string;
    horaCierreCadena!:   string;
    intervaloMinutos!:   string;
    idEmpleado!:         IUsuario;

    constructor() {
        super();
    }

    serialize(): IHorarioAgenda {
        return super.serialize();
    }

    getFormGroup(): FormGroup {
        return fb.group({
            dia: [this.dia],
            horaAperturaCadena: [this.horaAperturaCadena, Validators.required],
            horaCierreCadena: [this.horaCierreCadena, Validators.required],
            intervaloMinutos: [this.intervaloMinutos, Validators.required],
            idEmpleado: [this.idEmpleado, Validators.required],
        });
    }

    copy(object: IHorarioAgenda): HorarioAgendaModel {
        this.dia = object.dia;
        this.horaAperturaCadena = object.horaAperturaCadena;
        this.horaCierreCadena = object.horaCierreCadena;
        this.intervaloMinutos = object.intervaloMinutos;
        this.idEmpleado = object.idEmpleado;
        return this;
    }

}