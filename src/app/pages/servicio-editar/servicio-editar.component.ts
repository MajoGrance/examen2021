import { Component, OnInit, Type, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoriaModel } from 'src/app/models/categoria.model';
import { ClienteModel, ICliente } from 'src/app/models/cliente.model';
import { FichaClinicaModel } from 'src/app/models/ficha-clinica.model';
import { PresentacionProductoModel } from 'src/app/models/presentacion-producto.model';
import { IServicio, ServicioModel } from 'src/app/models/servicio.model';
import { TipoProductoModel } from 'src/app/models/tipo-producto';
import { IUsuario, UsuarioModel } from 'src/app/models/usuario.model';
import { StringDatePipe } from 'src/app/pipes/stringDate.pipe';
import { TimePipe } from 'src/app/pipes/time.pipe';
import { CategoriaService } from 'src/app/services/abm/categoria.service';
import { ClienteService } from 'src/app/services/abm/cliente.service';
import { PresentacionProductoService } from 'src/app/services/abm/presentacion-producto.service';
import { ReservaService } from 'src/app/services/abm/reserva.service';
import { TipoProductoService } from 'src/app/services/abm/tipo-producto.service';
import { UsuariosService } from 'src/app/services/abm/usuario.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';
import { ServicioService } from '../../services/abm/servicio.service';
import { IFichaClinica } from '../../models/ficha-clinica.model';
import { ITipoProducto } from '../../models/tipo-producto';
import { ICategoria } from '../../models/categoria.model';
import { ExistenciaProductoService } from '../../services/abm/existencia-producto.service';
import { IPresentacionProducto } from '../../models/presentacion-producto.model';
import { ServicioDetalleService } from '../../services/abm/servicio-detalle.service';
import { IServicioDetalle } from '../../models/servicio.model';
import { MensajesService } from '../../services/mensajes.service';

@Component({
    selector: 'app-servicio-editar',
    templateUrl: './servicio-editar.component.html',
    styleUrls: ['./servicio-editar.component.scss'],
    providers: [StringDatePipe, TimePipe]
})
export class ServicioEditarComponent implements OnInit, OnDestroy {

    servicio: FormGroup = new ServicioModel().getFormGroup();
    empleadoModel: Type<any> = UsuarioModel;
    clienteModel: Type<any> = ClienteModel;
    source: any[] = [];
    fichas: any[] = [];
    innerWidth = window.innerWidth;
    categoriaModel = CategoriaModel;
    TipoProductoModel = TipoProductoModel;
    presentacionModel = PresentacionProductoModel;
    seleccionado = new FormControl();
    detalle: FormGroup = this.fb.group({
        categoria: ['',Validators.required],
        subcategoria: ['',Validators.required],
        tipo_servicio: ['',Validators.required],
        precio: [''],
        cantidad: [1],
    });
    lastCategoria = '';
    lastTipoProducto = '';
    subcriptions: Subscription[] = [];
    id!: number;

    get filtrosPresentacionProducto(): any {
        const obj = this.detalle.value;
        const ret: any = {
            idProducto: {
                idTipoProducto: {
                    idTipoProducto: Number(obj.subcategoria)
                }
            },
        }
        return ret;
    }

    get filtroSubCategoria(): any {
        const obj = {
            idCategoria: {
                idCategoria: this.detalle.value.categoria
            }
        };
        return obj;
    }

    constructor(
        public empleadoService: UsuariosService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        public clienteService: ClienteService,
        private servicioService: ServicioService,
        private stringDate: StringDatePipe,
        private loadingService: LoadingService,
        private toastService: ToastService,
        private reservaService: ReservaService,
        public categoriaService: CategoriaService,
        public tipoProductoService: TipoProductoService,
        public presentacionProductoService: PresentacionProductoService,
        private existenciaProducto: ExistenciaProductoService,
        private servicioDetalle: ServicioDetalleService,
        private mensajeService: MensajesService
    ) { }

    ngOnDestroy(): void {
        this.subcriptions.forEach( sub => {
            sub.unsubscribe();
        })
    }

    ngOnInit(): void {
        this.getObject();
    }

    async getObject(): Promise<void> {
        this.subcriptions.push(
            this.route.params.subscribe( params => {
                this.id = +params['id']
            })
        )
        const resp = await this.servicioService.get(this.id);
        if ( resp.ok ) {
            this.servicio = new ServicioModel().deserialize(resp.resp).getFormGroup();
            this.getDetalles();
        }
    }

    pasteCategoria(obj: ICategoria): void {
        if (this.lastCategoria !== String(obj?.idCategoria)) {
            this.detalle.get('subcategoria')?.setValue('');
            this.detalle.get('tipo_servicio')?.setValue('');
            this.lastCategoria = String(obj?.idCategoria)
        }
    }

    pasteSubCategoria(obj: ITipoProducto): void {
        if (this.lastTipoProducto !== String(obj?.idTipoProducto)) {
            this.detalle.get('tipo_servicio')?.setValue('');
            this.lastTipoProducto = String(obj?.idCategoria)
        }
    }

    async pastePresentacionProducto(obj: IPresentacionProducto): Promise<void> {
        const filter = {"idPresentacionProductoTransient": obj.idPresentacionProducto}
        const resp = await this.existenciaProducto.getAll(filter);
        if (resp.ok) {
            const objr = resp.resp[0]
            this.detalle.get('precio')?.setValue(objr?objr.precioVenta:0)
        }
    }

    async save(): Promise<void> {
        this.servicio.markAllAsTouched();
        if (this.servicio.valid) {
            const obj: IServicio = this.servicio.getRawValue();
            const form = {
                // idFichaClinica: {
                //     idFichaClinica: obj?.idFichaClinica?.idFichaClinica
                // },
                idServicio: obj.idServicio,
                observacion: obj?.observacion
            }
            const resp = await this.servicioService.put(obj?.idServicio, form);
            console.log(resp);
            if (resp.ok) {
                this.toastService.show('top-right', 'success', resp.msg, resp?.resp?.idServicio);
                this.router.navigate(['sitio','servicios','lista']);
            } else {
                this.toastService.show('top-right', 'error', resp.msg, resp.resp);
            }
        }
    }

    async agregarDetalle(): Promise<void> {
        this.detalle.markAllAsTouched();
        if ( this.detalle.valid && this.detalle?.value ) {
            const obj = {
                cantidad: this.detalle.value.cantidad,
                idPresentacionProducto: {
                    idPresentacionProducto: this.detalle.value.tipo_servicio
                },
                idServicio: {
                    idServicio: this.servicio.value.idServicio
                }
            }
            const resp = await this.servicioDetalle.post(obj, this.servicio.value.idServicio);
            if (resp.ok) {
                this.toastService.show('top-right', 'success', resp.msg, resp.resp);
                this.getDetalles();
            } else {
                console.log(resp.resp);
                this.toastService.show('top-right', 'error', resp.msg, resp.resp)
            }
        }
    }

    getFechaHora(obj: any): IServicio {
        obj.fechaCadena = this.stringDate.inverse(obj.fechaCadena).replace(/-/g, '');
        obj.idCliente = {idPersona: obj.idCliente?.idPersona}
        obj.idEmpleado = {idPersona: obj.idEmpleado?.idPersona}
        return obj;
    }

    async pasteCliente(obj: ICliente): Promise<void> {
        this.servicio.get('idCliente')?.setValue(obj);
        this.servicio.get('cliente_nombre')?.setValue(`${obj?.nombre?obj.nombre:''} ${obj?.apellido?obj?.apellido:''}`);
    }

    async pasteEmpleado(obj: IUsuario): Promise<void> {
        this.servicio.get('idEmpleado')?.setValue(obj);
        this.servicio.get('empleado_nombre')?.setValue(`${obj?.nombre?obj.nombre:''} ${obj?.apellido?obj?.apellido:''}`);
    }

    async getDetalles(): Promise<void> {
        const resp = await this.servicioDetalle.getAll({idServicio: this.servicio.value.idServicio});
        if (resp.ok) {
            const lista = resp.resp;
            for (const obj of lista) {
                const filter = {"idPresentacionProductoTransient": obj.idPresentacionProducto?.idPresentacionProducto}
                const resp = await this.existenciaProducto.getAll(filter);
                if (resp.ok) {
                    const objr = resp.resp[0]
                    obj.precioUnitario = objr?objr.precioVenta:0;
                    obj.total = objr?objr.precioVenta*obj.cantidad:0;
                }
            }
            this.source = lista;
        }
    }

    async deleteDetalle(row: any): Promise<void> {
        const confirmacion = await this.mensajeService.eliminarRegistros([row]);
        if (confirmacion) {
            const resp = await this.servicioDetalle.delete(row.idServicioDetalle, row.idServicio?.idServicio);
            if (resp.ok) {
                this.toastService.show('top-right', 'success', resp.msg, resp.resp);
                this.getDetalles();
            } else {
                this.toastService.show('top-right', 'success', resp.msg, resp.resp)
            }
        }
    }
}
