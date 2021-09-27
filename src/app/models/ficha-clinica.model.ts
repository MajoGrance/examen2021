import { RecordModel } from './base.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUsuario } from './usuario.model';
import { ITipoProducto } from './tipo-producto';

const fb = new FormBuilder();

export interface IFichaClinica {
    idFichaClinica:  number;
    motivoConsulta:  string,
    diagnostico:     string,
    observacion:     string,
    idEmpleado:      IUsuario,
    idCliente:       IUsuario,
    idTipoProducto:  ITipoProducto,
    profesional?:    string,
    cliente?:        string
    categoria?:      string
    subcategoria?:   string
    fechaHoraCadena: string
}

export class FichaClinicaModel extends RecordModel implements IFichaClinica {
    idFichaClinica!:  number;
    motivoConsulta!:  string;
    diagnostico!:     string;
    observacion!:     string;
    idEmpleado!:      IUsuario;
    idCliente!:       IUsuario;
    idTipoProducto!:  ITipoProducto;
    fechaHoraCadena!: string


    constructor() {
        super();
    }

    serialize(): IFichaClinica {
        return super.serialize();
    }

    getFormGroup(): FormGroup {
        return fb.group({
            idFichaClinica: [this.idFichaClinica],
            motivoConsulta: [this.motivoConsulta, Validators.required],
            diagnostico: [this.diagnostico, Validators.required],
            fechaHoraCadena: [this.fechaHoraCadena],
            observacion: [this.observacion],
            idEmpleado: [this.idEmpleado, Validators.required],
            idCliente: [this.idCliente, Validators.required],
            idTipoProducto: [this.idTipoProducto, Validators.required],
            cliente: [this.idCliente?.idPersona, Validators.required],
            cliente_nombre: [`${this.idCliente?.nombre?this.idCliente?.nombre:''} ${this.idCliente?.apellido?this.idCliente?.apellido:''}`],
            empleado: [this.idEmpleado?.idPersona, Validators.required],
            empleado_nombre: [`${this.idEmpleado?.nombre?this.idEmpleado?.nombre:''} ${this.idEmpleado?.apellido?this.idEmpleado?.apellido:''}`],
            // categoria: [this.idCliente?.idPersona],
            // categoria_nombre: [`${this.idCliente?.nombre?this.idCliente?.nombre:''} ${this.idCliente?.apellido?this.idCliente?.apellido:''}`],
            subcategoria: [this.idTipoProducto?.idTipoProducto, Validators.required],
            subcategoria_nombre: [`${this.idTipoProducto?.descripcion?this.idTipoProducto?.descripcion:''}`],
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