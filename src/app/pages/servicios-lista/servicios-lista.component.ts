import { Component, OnInit, Type, HostListener } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';
import { ClienteModel } from '../../models/cliente.model';
import { CategoriaModel, ICategoria } from '../../models/categoria.model';
import { TipoProductoModel } from '../../models/tipo-producto';
import { IServicio, ServicioModel } from '../../models/servicio.model';
import { UsuariosService } from '../../services/abm/usuario.service';
import { ClienteService } from '../../services/abm/cliente.service';
import { ServicioService } from '../../services/abm/servicio.service';
import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';
import { StringDatePipe } from '../../pipes/stringDate.pipe';
import { CategoriaService } from '../../services/abm/categoria.service';
import { TipoProductoService } from '../../services/abm/tipo-producto.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-servicios-lista',
    templateUrl: './servicios-lista.component.html',
    styleUrls: ['./servicios-lista.component.scss'],
    providers: [StringDatePipe]
})
export class ServiciosListaComponent implements OnInit {
    filters: FormGroup = this.fb.group({
        fecha_desde: [new Date(), Validators.required],
        fecha_hasta: [new Date(), Validators.required],
        empleado: [''],
        cliente: [''],
        categoria: [''],
        subcategoria: ['']
    });
    empleadoModel: Type<any> = UsuarioModel;
    clienteModel: Type<any> = ClienteModel;
    categoriaModel: Type<any> = CategoriaModel;
    tipoProductoModel: Type<any> = TipoProductoModel;
    source: IServicio[] = [];
    innerWidth = window.innerWidth;
    displayEditar = false;
    lastCategoria = '';
    servicioForm = new ServicioModel().getFormGroup();

    @HostListener('window:resize')
    onResize(): void {
        this.innerWidth = window.innerWidth;
    }

    get filtroSubCategoria(): any {
        const obj = {
            idCategoria: {
                idCategoria: this.filters.value.categoria
            }
        };
        return obj;
    }

    constructor(
        private fb: FormBuilder,
        public empleadoService: UsuariosService,
        public clienteService: ClienteService,
        private servicioService: ServicioService,
        private loadingService: LoadingService,
        private toastService: ToastService,
        private stringDate: StringDatePipe,
        public categoriaService: CategoriaService,
        public tipoProductoService: TipoProductoService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.init();
    }
    
    async init(): Promise<void> {
        await this.getServicios();
    }

    async getServicios(): Promise<void> {
        this.loadingService.setLoading(true);
        const filters: any = {
            fechaDesdeCadena: this.stringDate.inverse(this.filters?.value?.fecha_desde).replace(/-/g, ''),
            fechaHastaCadena: this.stringDate.inverse(this.filters?.value?.fecha_hasta).replace(/-/g, '')
        };
        if (this.filters.value.cliente) {
            filters.idFichaClinica = {"idCliente": {"idPersona": Number(this.filters.value.cliente)}};
        }
        if (this.filters.value.empleado) {
            filters.idEmpleado = {"idPersona": Number(this.filters.value.empleado)};
        }
        const resp = await this.servicioService.getAll(filters);
        if (resp.ok) {
            const source = (resp.resp as IServicio[])
            for (const obj of source) {
                obj.profesional = `${obj.idFichaClinica?.idEmpleado?.nombre} ${obj.idFichaClinica?.idEmpleado?.apellido}`;
                obj.cliente = `${obj.idFichaClinica?.idCliente?.nombre} ${obj.idFichaClinica?.idCliente?.apellido}`;
                obj.categoria = `${obj.idFichaClinica?.idTipoProducto?.idCategoria?.descripcion?obj.idFichaClinica?.idTipoProducto?.idCategoria?.descripcion:''}`;
                obj.subcategoria = `${obj.idFichaClinica?.idTipoProducto?.descripcion?obj.idFichaClinica?.idTipoProducto?.descripcion:''}`;
            }
            this.source = source;
            this.loadingService.setLoading(false);
        } else {
            this.toastService.show('top-right', 'error', resp.msg, resp.resp);
        }
    }

    async limpiar(): Promise<void> {
        this.filters = this.fb.group({
            fecha_desde: [new Date(), Validators.required],
            fecha_hasta: [new Date(), Validators.required],
            empleado: [''],
            cliente: [''],
            categoria: [''],
            subcategoria: ['']
        });
        this.filters.controls.subcategoria.disable();
        this.getServicios();
    }
    
    async navigate(url: string): Promise<void> {
        await this.router.navigate([url]);
    }

    async editarServicio(row: IServicio): Promise<void> {
        this.loadingService.setLoading(true);
        const resp = await this.servicioService.get(row.idServicio);
        if (resp.ok) {
            this.router.navigate(['sitio','servicios', row.idServicio])
        } else {
            this.toastService.show('top-right', 'error', resp.msg, resp.resp);
        }
        this.loadingService.setLoading(false);
    }

    pasteCategoria(obj: ICategoria): void {
        if (this.lastCategoria !== String(obj?.idCategoria)) {
            this.filters.get('subcategoria')?.setValue(null);
            this.lastCategoria = String(obj?.idCategoria)
        }
    }
}
