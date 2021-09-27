import { RecordModel } from './base.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUsuario } from './usuario.model';
import { SeguridadService } from '../services/seguridad.service';
import { StringDatePipe } from '../pipes/stringDate.pipe';

const fb = new FormBuilder();
const seguridad = new SeguridadService();
const stringDate = new StringDatePipe();

export interface IReservaTurno {
    idReserva:         number,
    fechaCadena:       string,
    horaInicioCadena:  string,
    horaFinCadena:     string,
    idEmpleado:        IUsuario,
    idCliente:         IUsuario,
    observacion:       string,
    profesional?:      string,
    cliente?:          string,
    flagAsistio:       string
}

export class ReservaTurnoModel extends RecordModel implements IReservaTurno{
    idReserva!:        number;
    fechaCadena!:      string;
    horaInicioCadena!: string;
    horaFinCadena!:    string;
    observacion!:      string;
    idEmpleado!:       IUsuario;
    idCliente!:        IUsuario;
    flagAsistio!:      string;

    constructor() {
        super();
        this.fechaCadena = stringDate.inverse(new Date());
        const idEmpleado = seguridad.getCurrentUser();
        if (idEmpleado) {
            this.idEmpleado = idEmpleado;
        }
    }

    serialize(): IReservaTurno {
        return super.serialize();
    }

    getFormGroup(): FormGroup {
        return fb.group({
            idReserva: [this.idReserva],
            fechaCadena: [this.fechaCadena, Validators.required],
            horaInicioCadena: [this.horaInicioCadena],
            horaFinCadena: [this.horaFinCadena],
            idEmpleado: [this.idEmpleado, Validators.required],
            idCliente: [this.idCliente, Validators.required],
            cliente: [this.idCliente?.idPersona, Validators.required],
            cliente_nombre: [`${this.idCliente?.nombre?this.idCliente?.nombre:''} ${this.idCliente?.apellido?this.idCliente?.apellido:''}`],
            empleado: [this.idEmpleado?.idPersona, Validators.required],
            empleado_nombre: [`${this.idEmpleado?.nombre?this.idEmpleado?.nombre:''} ${this.idEmpleado?.apellido?this.idEmpleado?.apellido:''}`],
            observacion: [this.observacion],
            flagAsistio: [this.flagAsistio],
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