import { RecordModel } from './base.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUsuario } from './usuario.model';
import { ITipoProducto } from './tipo-producto';

const fb = new FormBuilder();

export interface IFichaClinica {
    motivoConsulta:  string,
    diagnostico:     string,
    observacion:     string,
    idEmpleado:      IUsuario,
    idCliente:       IUsuario,
    idTipoProducto:  ITipoProducto,
}

export class FichaClinicaModel extends RecordModel implements IFichaClinica {
    motivoConsulta!: string;
    diagnostico!:    string;
    observacion!:    string;
    idEmpleado!:     IUsuario;
    idCliente!:      IUsuario;
    idTipoProducto!: ITipoProducto;

    constructor() {
        super();
    }

    serialize(): IFichaClinica {
        return super.serialize();
    }

    getFormGroup(): FormGroup {
        return fb.group({
            motivoConsulta: [this.motivoConsulta, Validators.required],
            diagnostico: [this.diagnostico, Validators.required],
            observacion: [this.observacion, Validators.required],
            idEmpleado: [this.idEmpleado, Validators.required],
            idCliente: [this.idCliente, Validators.required],
            idTipoProducto: [this.idTipoProducto, Validators.required],
        });
    }

    copy(object: IFichaClinica): FichaClinicaModel {
        this.motivoConsulta = object.motivoConsulta;
        this.diagnostico = object.diagnostico;
        this.observacion = object.observacion;
        this.idEmpleado = object.idEmpleado;
        this.idCliente = object.idCliente;
        this.idTipoProducto = object.idTipoProducto;
        return this;
    }
}