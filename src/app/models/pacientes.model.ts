import { RecordModel } from './base.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const fb = new FormBuilder();

export interface IPaciente {
    idPersona:        number,
    nombre:           string,
    apellido:         string,
    telefono:         string,
    email:            string,
    ruc:              string,
    cedula:           string,
    tipoPersona:      string,
    fechaNacimiento:  Date,
}

export class PacienteModel extends RecordModel implements IPaciente{
    idPersona!:       number;
    nombre!:          string;
    apellido!:        string;
    telefono!:        string;
    email!:           string;
    ruc!:             string;
    cedula!:          string;
    tipoPersona!:     string;
    fechaNacimiento!: Date;

    constructor() {
        super();
        this.tipoPersona = "FISICA";
    }

    getId(): number {
        return this.idPersona;
    }

    setId(id: number): void {
        this.idPersona = id;
    }

    serialize(): IPaciente {
        return super.serialize();
    }

    getFormGroup(): FormGroup {
        return fb.group({
            idPersona: [this.idPersona],
            nombre: [this.nombre, Validators.required],
            apellido: [this.apellido, Validators.required],
            telefono: [this.telefono, Validators.required],
            email: [this.email, Validators.required],
            ruc: [this.ruc, Validators.required],
            cedula: [this.cedula, Validators.required],
            tipoPersona: [this.tipoPersona, Validators.required],
            fechaNacimiento: [this.fechaNacimiento, Validators.required],
        });
    }

    copy(object: IPaciente): PacienteModel {
        this.nombre = object.nombre;
        this.apellido = object.apellido;
        this.telefono = object.telefono;
        this.email = object.email;
        this.ruc = object.ruc;
        this.cedula = object.cedula;
        this.tipoPersona = object.tipoPersona;
        this.fechaNacimiento = object.fechaNacimiento;
        return this;
    }

}