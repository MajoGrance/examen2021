import { RecordModel } from './base.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUsuario } from './usuario.model';

const fb = new FormBuilder();

export interface IReservaTurno {
    fechaCadena:       string,
    horaInicioCadena:  string,
    horaFinCadena:     string,
    idEmpleado:        IUsuario,
    idCliente:         IUsuario,
}

export class ReservaTurnoModel extends RecordModel implements IReservaTurno{
    fechaCadena!:      string;
    horaInicioCadena!: string;
    horaFinCadena!:    string;
    idEmpleado!:       IUsuario;
    idCliente!:        IUsuario;

    constructor() {
        super();
    }

    serialize(): IReservaTurno {
        return super.serialize();
    }

    getFormGroup(): FormGroup {
        return fb.group({
            fechaCadena: [this.fechaCadena, Validators.required],
            horaInicioCadena: [this.horaInicioCadena, Validators.required],
            horaFinCadena: [this.horaFinCadena, Validators.required],
            idEmpleado: [this.idEmpleado, Validators.required],
            idCliente: [this.idCliente, Validators.required],
        });
    }

    copy(object: IReservaTurno): ReservaTurnoModel {
        this.fechaCadena = object.fechaCadena;
        this.horaInicioCadena = object.horaInicioCadena;
        this.horaFinCadena = object.horaFinCadena;
        this.idEmpleado = object.idEmpleado;
        this.idCliente = object.idCliente;
        return this;
    }

}