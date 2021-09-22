import { RecordModel } from './base.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUsuario } from './usuario.model';
import { ServiceResponse } from '../shared/interfaces';

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
            fechaCadena: [this.fechaCadena, Validators.required],
            horaAperturaCadena: [this.horaAperturaCadena, Validators.required],
            horaCierreCadena: [this.horaCierreCadena, Validators.required],
            flagEsHabilitar: [this.flagEsHabilitar, Validators.required],
            idEmpleado: [this.idEmpleado, Validators.required],
            empleado_id: [this.idEmpleado?.idPersona, Validators.required],
            empleado_nombre: [this.idEmpleado?.nombre],
            intervaloMinutos: [this.intervaloMinutos],
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

    async save(service: any): Promise<ServiceResponse> {
        if (service && service.post && service.put) {
            let method;
            const obj = this.serialize();
            obj.horaAperturaCadena = obj.horaAperturaCadena.replace(':', '');
            obj.horaCierreCadena = obj.horaCierreCadena.replace(':', '');
            obj.horaCierreCadena = obj.horaCierreCadena.replace(/\//g, '');
            if (!this.getId()) {
                method = service.post(obj);
            } else {
                method = service.put(this.getId(), obj);
            }
            const resp = await method;
            if (resp.ok) {
                this.setId(resp.resp.id);
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