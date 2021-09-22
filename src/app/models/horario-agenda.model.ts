import { RecordModel } from './base.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUsuario } from './usuario.model';
import { ServiceResponse } from '../shared/interfaces';

const fb = new FormBuilder();

export interface IHorarioAgenda {
    idPersonaHorarioAgenda:  number;
    dia:                     number,
    horaAperturaCadena:      string,
    horaCierreCadena:        string,
    intervaloMinutos:        string,
    idEmpleado:              IUsuario,
}

export class HorarioAgendaModel extends RecordModel implements IHorarioAgenda{
    idPersonaHorarioAgenda!: number
    dia!:                    number;
    horaAperturaCadena!:     string;
    horaCierreCadena!:       string;
    intervaloMinutos!:       string;
    idEmpleado!:             IUsuario;

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
            intervaloMinutos: [this.intervaloMinutos],
            idEmpleado: [this.idEmpleado, Validators.required],
            empleado_id: [this.idEmpleado?.idPersona, Validators.required],
            empleado_nombre: [this.idEmpleado?.nombre],
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

    async save(service: any): Promise<ServiceResponse> {
        if (service && service.post && service.put) {
            let method;
            const obj = this.serialize();
            obj.horaAperturaCadena = obj.horaAperturaCadena.replace(':', '');
            obj.horaCierreCadena = obj.horaCierreCadena.replace(':', '');
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