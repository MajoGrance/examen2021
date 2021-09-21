import { RecordModel } from './base.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceResponse } from '../shared/interfaces';

const fb = new FormBuilder();

export interface IPaciente {
    idPersona?:       number,
    nombre:           string,
    apellido:         string,
    telefono:         string,
    email:            string,
    ruc:              string,
    cedula:           string,
    tipoPersona:      string,
    fechaNacimiento:  any,
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
    fechaNacimiento!: any;

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

    async save(service: any): Promise<ServiceResponse> {
        if (service && service.post && service.put) {
            let method;
            if (!this.getId()) {
                const obj = await this.serialize();
                obj.fechaNacimiento = obj.fechaNacimiento.toISOString().replace(/T.*$/, ' 00:00:00');
                method = service.post(obj);
            } else {
                const obj = await this.serialize();
                if (String(obj.fechaNacimiento).length === 10) {
                    obj.fechaNacimiento = `${obj.fechaNacimiento} 00:00:00`;
                    method = service.put(this.getId(), obj);
                } else {
                    obj.fechaNacimiento = obj.fechaNacimiento.toISOString().replace(/T.*$/, ' 00:00:00');
                    method = service.put(this.getId(), obj);
                }
            }
            const resp = await method;
            if (resp.ok) {
                this.setId(resp.resp?.idPersona);
            }
            return resp;
        } else {
            return {
                ok: false,
                msg: 'No se ha proveido servicio correctamente',
                resp: 'Provea el servicio para guardar y verifique que este implemente los métodos post y put'
            };
        }
    }

}