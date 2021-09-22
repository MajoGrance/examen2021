import { RecordModel } from './base.model';
import { FormBuilder } from '@angular/forms';
import { PasteItemInterface } from '../shared/interfaces';
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

    getPasteItems(objects: IUsuario[]): PasteItemInterface[] {
        const items: PasteItemInterface[] = [];
        for (const obj of objects) {
            const item: PasteItemInterface = {
                id: obj.idPersona,
                nombre: `${obj.idPersona} - ${obj.nombre} ${obj.apellido}`,
                descripcion: [
                    {icono: 'category', texto: `RUC: ${obj.ruc}`},
                    {icono: 'label', texto: `Cedula: ${obj.cedula}`}
                ],
                subtexto: this.usuarioLogin
            }
            items.push(item);
        }
        return items;
    }
}