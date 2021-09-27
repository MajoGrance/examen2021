import { Component, OnInit, Type, HostListener } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';
import { ClienteModel } from '../../models/cliente.model';
import { IFichaClinica, FichaClinicaModel } from '../../models/ficha-clinica.model';
import { UsuariosService } from '../../services/abm/usuario.service';
import { ClienteService } from '../../services/abm/cliente.service';
import { FichaClinicaService } from '../../services/abm/ficha-clinica.service';
import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';
import { StringDatePipe } from '../../pipes/stringDate.pipe';
import { Router } from '@angular/router';
import { CategoriaService } from '../../services/abm/categoria.service';
import { TipoProductoService } from '../../services/abm/tipo-producto.service';
import { TipoProductoModel } from '../../models/tipo-producto';
import { CategoriaModel, ICategoria } from '../../models/categoria.model';
import { MensajesService } from '../../services/mensajes.service';
import { CopyService } from '../../services/copy.service';

@Component({
    selector: 'app-fichas-clinicas-lista',
    templateUrl: './fichas-clinicas-lista.component.html',
    styleUrls: ['./fichas-clinicas-lista.component.scss'],
    providers: [StringDatePipe]
})
export class FichasClinicasListaComponent implements OnInit {
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
    source: IFichaClinica[] = [];
    innerWidth = window.innerWidth;
    displayEditar = false;
    fichaForm = new FichaClinicaModel().getFormGroup();

    @HostListener('window:resize')
    onResize(): void {
        this.innerWidth = window.innerWidth;
    }

    constructor(
        private fb: FormBuilder,
        public empleadoService: UsuariosService,
        public clienteService: ClienteService,
        private fichaService: FichaClinicaService,
        private loadingService: LoadingService,
        private toastService: ToastService,
        private stringDate: StringDatePipe,
        private mensajesService: MensajesService,
        private copyService: CopyService,
        public categoriaService: CategoriaService,
        public tipoProductoService: TipoProductoService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.init();
    }
    
    async init(): Promise<void> {
        await this.getFichas();
    }

    async getFichas(): Promise<void> {
        this.loadingService.setLoading(true);
        const filters: any = {
            fechaDesdeCadena: this.stringDate.inverse(this.filters?.value?.fecha_desde).replace(/-/g, ''),
            fechaHastaCadena: this.stringDate.inverse(this.filters?.value?.fecha_hasta).replace(/-/g, '')
        };
        if (this.filters.value.cliente) {
            filters.idCliente = {"idPersona": this.filters.value.cliente};
        }
        if (this.filters.value.empleado) {
            filters.idEmpleado = {"idPersona": this.filters.value.empleado};
        }
        const resp = await this.fichaService.getAll(filters);
        if (resp.ok) {
            const source = (resp.resp as IFichaClinica[])
            for (const obj of source) {
                obj.profesional = `${obj.idEmpleado?.nombre} ${obj.idEmpleado?.apellido}`;
                obj.cliente = `${obj.idCliente?.nombre} ${obj.idCliente?.apellido}`;
                obj.categoria = `${obj.idTipoProducto?.idCategoria?.descripcion?obj.idTipoProducto?.idCategoria?.descripcion:''}`;
                obj.subcategoria = `${obj.idTipoProducto?.descripcion?obj.idTipoProducto?.descripcion:''}`;
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
            cliente: ['']
        });
        this.getFichas();
    }
    
    async navigate(url: string): Promise<void> {
        await this.router.navigate([url]);
    }

    async editarFicha(row: IFichaClinica): Promise<void> {
        this.loadingService.setLoading(true);
        const resp = await this.fichaService.get(row.idFichaClinica);
        if (resp.ok) {
            // const obj: IFichaClinica = resp.resp;
            this.router.navigate(['sitio','fichas', row.idFichaClinica])
        } else {
            this.toastService.show('top-right', 'error', resp.msg, resp.resp);
        }
        this.loadingService.setLoading(false);
    }

    pasteCategoria(obj: ICategoria): void {
        this.fichaForm.get('subcategoria')?.setValue('');
        if (obj) {
            this.fichaForm.get('subcategoria')?.enable();
        } else {
            this.fichaForm.get('subcategoria')?.disable();
        }
    }

    async nuevoServicio(row: IFichaClinica): Promise<void> {
        this.loadingService.setLoading(true);
        const resp = await this.fichaService.get(row.idFichaClinica);
        if (resp.ok) {
            const resSiNo = await this.mensajesService.preguntarSiNo('Nuevo Servicio', 'Nuevo servicio para la ficha?');
            if ( resSiNo ) {
                this.copyService.object = row;
                this.copyService.url = 'sitio/servicios/agregar';
                this.router.navigate(['sitio','servicios','agregar'])
            }
        } else {
            this.toastService.show('top-right', 'error', resp.msg, resp.resp);
        }
        this.loadingService.setLoading(false);
    }
}
