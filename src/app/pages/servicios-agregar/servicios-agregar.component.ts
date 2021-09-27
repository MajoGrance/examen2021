import { Component, OnInit, Type } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ServicioModel, IServicio } from '../../models/servicio.model';
import { UsuarioModel, IUsuario } from '../../models/usuario.model';
import { ClienteModel, ICliente } from '../../models/cliente.model';
import { UsuariosService } from '../../services/abm/usuario.service';
import { ClienteService } from '../../services/abm/cliente.service';
import { StringDatePipe } from '../../pipes/stringDate.pipe';
import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';
import { IFichaClinica } from '../../models/ficha-clinica.model';
import { TimePipe } from '../../pipes/time.pipe';
import { CategoriaModel, ICategoria } from '../../models/categoria.model';
import { ITipoProducto, TipoProductoModel } from '../../models/tipo-producto';
import { PresentacionProductoModel, IPresentacionProducto } from '../../models/presentacion-producto.model';
import { TipoProductoService } from '../../services/abm/tipo-producto.service';
import { CategoriaService } from '../../services/abm/categoria.service';
import { PresentacionProductoService } from '../../services/abm/presentacion-producto.service';
import { FichaClinicaService } from '../../services/abm/ficha-clinica.service';
import { ExistenciaProductoService } from '../../services/abm/existencia-producto.service';
import { MensajesService } from '../../services/mensajes.service';
import { ServicioDetalleService } from '../../services/abm/servicio-detalle.service';
import { Router } from '@angular/router';
import { ServicioService } from '../../services/abm/servicio.service';
import { CopyService } from '../../services/copy.service';

@Component({
    selector: 'app-servicios-agregar',
    templateUrl: './servicios-agregar.component.html',
    styleUrls: ['./servicios-agregar.component.scss'],
    providers: [StringDatePipe, TimePipe]
})
export class ServiciosAgregarComponent implements OnInit {

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
        tipo_servicio_nombre: [''],
        precio: [''],
        cantidad: [1],
    });
    lastCategoria = '';
    lastTipoProducto = '';
    fecha = new FormControl(new Date());

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
        public clienteService: ClienteService,
        private stringDate: StringDatePipe,
        private toastService: ToastService,
        private fichaService: FichaClinicaService,
        private loadingService: LoadingService,
        public categoriaService: CategoriaService,
        public tipoProductoService: TipoProductoService,
        public presentacionProductoService: PresentacionProductoService,
        private existenciaProducto: ExistenciaProductoService,
        private mensajeService: MensajesService,
        private detalleServicio: ServicioDetalleService,
        private router: Router,
        private servicioService: ServicioService,
        private copyService: CopyService,
    ) { }

    ngOnInit(): void {
        if ( this.copyService.object && this.copyService.url === 'sitio/servicios/agregar') {
            console.log(this.copyService.object);
            this.servicio.get('idCliente')?.setValue(this.copyService.object.idCliente);
            this.servicio.get('cliente')?.setValue(this.copyService.object.idCliente.idPersona);
            this.pasteCliente(this.copyService.object.idCliente);
            this.servicio.get('idEmpleado')?.setValue(this.copyService.object.idEmpleado);
            this.servicio.get('empleado')?.setValue(this.copyService.object.idEmpleado.idPersona);
            this.pasteEmpleado(this.copyService.object.idEmpleado);
        }
    }

    async save(): Promise<void> {
        this.servicio.markAllAsTouched();
        const send = this.fb.group({
            idFichaClinica: [{idFichaClinica: this.seleccionado.value.idFichaClinica}, Validators.required],
            observacion: [this.servicio.value.observacion]
        })
        if (send.valid && this.seleccionado.value) {
            const resp = await this.servicioService.post(send.value);
            if (resp.ok) {
                for (const row of this.source) {
                    const obj = {
                        cantidad: this.detalle.value.cantidad,
                        idPresentacionProducto: {
                            idPresentacionProducto: row.idPresentacionProducto?.idPresentacionProducto
                        },
                        idServicio: {
                            idServicio: resp.resp?.idServicio
                        }
                    }
                    const respDetalle = await this.detalleServicio.post(obj, resp.resp?.idServicio);
                    if (!respDetalle.ok) {
                        this.toastService.show('top-right', 'error', respDetalle.msg, respDetalle.resp);
                        return;
                    }
                }
                this.servicio = new ServicioModel().getFormGroup();
                this.toastService.show('top-right', 'success', resp.msg, resp.resp?.idFichaClinica);
                await this.router.navigate(['/sitio/servicios/lista']);
            } else {
                this.toastService.show('top-right', 'error', resp.msg, resp.resp);
            }
        }
    }

    getFechaHora(obj: any): IServicio {
        obj.idCliente = {idPersona: obj.idCliente?.idPersona}
        obj.idEmpleado = {idPersona: obj.idEmpleado?.idPersona}
        return obj;
    }

    async pasteCliente(obj: ICliente): Promise<void> {
        this.servicio.get('idCliente')?.setValue(obj);
        this.servicio.get('cliente_nombre')?.setValue(`${obj?.nombre?obj.nombre:''} ${obj?.apellido?obj?.apellido:''}`);
        await this.getFichas();
    }

    async pasteEmpleado(obj: IUsuario): Promise<void> {
        this.servicio.get('idEmpleado')?.setValue(obj);
        this.servicio.get('empleado_nombre')?.setValue(`${obj?.nombre?obj.nombre:''} ${obj?.apellido?obj?.apellido:''}`);
        await this.getFichas();
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
            this.detalle.get('tipo_servicio_nombre')?.setValue('');
            this.lastTipoProducto = String(obj?.idCategoria)
        }
    }

    async pastePresentacionProducto(obj: IPresentacionProducto): Promise<void> {
        this.detalle.get('tipo_servicio_nombre')?.setValue(obj?.nombre);
        const filter = {"idPresentacionProductoTransient": obj.idPresentacionProducto}
        const resp = await this.existenciaProducto.getAll(filter);
        if (resp.ok) {
            const objr = resp.resp[0]
            this.detalle.get('precio')?.setValue(objr?objr.precioVenta:0)
        }
    }

    async getFichas(): Promise<void> {
        this.seleccionado.setValue('');
        const value = this.servicio.getRawValue();
        this.fichas = [];
        if ( !value.cliente || !value.empleado || !this.fecha.value) {
            return;
        }
        this.loadingService.setLoading(true);
        const filters = await this.getFilters(value);
        filters.fechaDesdeCadena = this.stringDate.inverse(this.fecha.value)?.replace(/-/g, '');
        filters.fechaHastaCadena = this.stringDate.inverse(this.fecha.value)?.replace(/-/g, '');
        const resp = await this.fichaService.getAll(filters)
        if ( resp.ok ) {
            const fichas = (resp.resp as IFichaClinica[]);
            for (const ficha of fichas) {
                ficha.categoria = ficha?.idTipoProducto?.idCategoria?.descripcion
                ficha.subcategoria = ficha?.idTipoProducto?.descripcion
            }
            this.fichas = fichas;
        } else {
            this.toastService.show('top-right', 'error', resp.msg, resp.resp);
        }
        this.loadingService.setLoading(false);
    }

    async getFilters( value: any ): Promise<any> {
        const filters: any = {}
        if ( value.cliente ) {
            filters.idCliente = {"idPersona": Number(value.cliente ) }
        }
        if ( value.empleado ) {
            filters.idEmpleado = {"idPersona": Number(value.empleado ) }
        }
        return filters
    }

    async agregarDetalle(): Promise<void> {
        this.detalle.markAllAsTouched();
        if ( this.detalle.valid && this.detalle?.value ) {
            this.source.push({
                idPresentacionProducto: {
                    idPresentacionProducto: this.detalle?.value.tipo_servicio,
                    nombre: this.detalle?.value.tipo_servicio_nombre,
                },
                precioUnitario: this.detalle?.value.precio,
                cantidad: this.detalle?.value.cantidad,
                total: this.detalle?.value.cantidad * this.detalle?.value.precio
            });
            this.resetDetalle();
        }
    }

    async deleteDetalle(idx: number): Promise<void> {
        const confirmacion = await this.mensajeService.eliminarRegistros([idx]);
        if (confirmacion) {
            this.source.splice(idx, 1);
        }
    }

    resetDetalle(): void {
        this.detalle = this.fb.group({
            categoria: ['',Validators.required],
            subcategoria: ['',Validators.required],
            tipo_servicio: ['',Validators.required],
            tipo_servicio_nombre: [''],
            precio: [''],
            cantidad: [1],
        });
    }
}
