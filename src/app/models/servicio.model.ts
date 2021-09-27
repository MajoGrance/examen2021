import { RecordModel } from './base.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFichaClinica } from './ficha-clinica.model';
import { IPresentacionProducto } from './presentacion-producto.model';

const fb = new FormBuilder();

export interface IServicio {
    idServicio:             number,
    idFichaClinica:         IFichaClinica,
    observacion:            string,
    profesional?:           string,
    cliente?:               string
    categoria?:             string
    subcategoria?:          string
}

export interface IServicioDetalle {
    cantidad:                number,
    idPresentacionProducto:  IPresentacionProducto,
    idServicio:              IServicio,
}

export class ServicioModel extends RecordModel implements IServicio {
    idServicio!:             number;
    idFichaClinica!:         IFichaClinica;
    observacion!:            string;

    constructor() {
        super();
    }

    getId(): number {
        return this.idServicio;
    }

    setId(id: number): void {
        this.idServicio = id;
    }

    serialize(): IServicio {
        return super.serialize();
    }

    getFormGroup(): FormGroup {
        return fb.group({
            idServicio: [this.idServicio],
            idFichaClinica: [this.idFichaClinica, Validators.required],
            observacion: [this.observacion],
            ficha_clinica: [this.idFichaClinica?.idFichaClinica],
            cliente: [this.idFichaClinica?.idCliente?.idPersona, Validators.required],
            cliente_nombre: [`${this.idFichaClinica?.idCliente?.nombre?this.idFichaClinica?.idCliente?.nombre:''} ${this.idFichaClinica?.idCliente?.apellido?this.idFichaClinica?.idCliente?.apellido:''}`],
            empleado: [this.idFichaClinica?.idEmpleado?.idPersona, Validators.required],
            empleado_nombre: [`${this.idFichaClinica?.idEmpleado?.nombre?this.idFichaClinica?.idEmpleado?.nombre:''} ${this.idFichaClinica?.idEmpleado?.apellido?this.idFichaClinica?.idEmpleado?.apellido:''}`],
        });
    }

    copy(object: IServicio): ServicioModel {
        this.idFichaClinica = object.idFichaClinica;
        this.observacion = object.observacion;
        return this;
    }
}

export class ServicioDetalleModel extends RecordModel implements IServicioDetalle {
    cantidad!:               number;
    idPresentacionProducto!: IPresentacionProducto;
    idServicio!:             IServicio;

    constructor() {
        super();
    }

    serialize(): IServicio {
        return super.serialize();
    }

    getFormGroup(): FormGroup {
        return fb.group({
            cantidad: [this.cantidad, Validators.required],
            idPresentacionProducto: [this.idPresentacionProducto, Validators.required],
            idServicio: [this.idServicio, Validators.required],
        });
    }

    copy(object: IServicioDetalle): ServicioDetalleModel {
        this.cantidad = object.cantidad;
        this.idPresentacionProducto = object.idPresentacionProducto;
        this.idServicio = object.idServicio;
        return this;
    }
}