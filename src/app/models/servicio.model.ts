import { RecordModel } from './base.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFichaClinica } from './ficha-clinica.model';
import { IPresentacionProducto } from './presentacion-producto.model';

const fb = new FormBuilder();

export interface IServicio {
    idServicio:             number,
    idFichaClinica:         IFichaClinica,
    observacion:            string,
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
            observacion: [this.observacion, Validators.required],
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