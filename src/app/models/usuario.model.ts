import { RecordModel } from './base.model';
import { FormBuilder } from '@angular/forms';
const fb = new FormBuilder();

export interface IUsuario {
    idPersona:       number;
    nombre:          string;
    apellido:        string;
    email:           string;
    telefono:        string;
    ruc:             string;
    cedula:          string;
    tipoPersona:     string;
    fechaNacimiento: Date;
    usuarioLogin:    string;
}

export class UsuarioModel extends RecordModel implements IUsuario{
    idPersona!:       number;
    nombre!:          string;
    apellido!:        string;
    email!:           string;
    telefono!:        string;
    ruc!:             string;
    cedula!:          string;
    tipoPersona!:     string;
    fechaNacimiento!: Date;
    usuarioLogin!:    string;

    serialize(): IUsuario {
        return super.serialize();
    }
}