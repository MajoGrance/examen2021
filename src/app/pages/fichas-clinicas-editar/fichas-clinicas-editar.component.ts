import { Component, OnInit, Type, OnDestroy } from '@angular/core';
import { StringDatePipe } from '../../pipes/stringDate.pipe';
import { TimePipe } from '../../pipes/time.pipe';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FichaClinicaModel, IFichaClinica } from '../../models/ficha-clinica.model';
import { UsuarioModel, IUsuario } from '../../models/usuario.model';
import { ClienteModel, ICliente } from '../../models/cliente.model';
import { UsuariosService } from '../../services/abm/usuario.service';
import { ClienteService } from '../../services/abm/cliente.service';
import { ToastService } from '../../services/toast.service';
import { CopyService } from '../../services/copy.service';
import { CategoriaModel } from 'src/app/models/categoria.model';
import { CategoriaService } from '../../services/abm/categoria.service';
import { TipoProductoService } from '../../services/abm/tipo-producto.service';
import { TipoProductoModel } from 'src/app/models/tipo-producto';
import { FichaClinicaService } from '../../services/abm/ficha-clinica.service';
import { ITipoProducto } from '../../models/tipo-producto';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ServicioService } from '../../services/abm/servicio.service';
import { IServicio } from '../../models/servicio.model';

@Component({
    selector: 'app-fichas-clinicas-editar',
    templateUrl: './fichas-clinicas-editar.component.html',
    styleUrls: ['./fichas-clinicas-editar.component.scss'],
    providers: [StringDatePipe, TimePipe]
})
export class FichasClinicasEditarComponent implements OnInit, OnDestroy {

    ficha: FormGroup = new FichaClinicaModel().getFormGroup();
    empleadoModel: Type<any> = UsuarioModel;
    clienteModel: Type<any> = ClienteModel;
    categoriaModel: Type<any> = CategoriaModel;
    tipoProductoModel: Type<any> = TipoProductoModel;
    source: any[] = [];
    subcriptions: Subscription[] = [];
    innerWidth = window.innerWidth;
    id!: number;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public empleadoService: UsuariosService,
        public clienteService: ClienteService,
        private stringDate: StringDatePipe,
        private route: ActivatedRoute,
        private toastService: ToastService,
        private fichaClinicaService: FichaClinicaService,
        private copyService: CopyService,
        public categoriaService: CategoriaService,
        public tipoProductoService: TipoProductoService,
        private serviciosService: ServicioService
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
        const resp = await this.fichaClinicaService.get(this.id);
        if ( resp.ok ) {
            this.ficha = new FichaClinicaModel().deserialize(resp.resp).getFormGroup();
            this.getServicios();
        }
    }

    async save(): Promise<void> {
        this.ficha.markAllAsTouched();
        if (this.ficha.valid && this.ficha?.value) {
            const obj = this.ficha.getRawValue();
            const form = this.fb.group({
                idFichaClinica: obj?.idFichaClinica,
                observacion: obj?.observacion
            })
            const resp = await this.fichaClinicaService.put(obj?.idFichaClinica, form.getRawValue());
            if (resp.ok) {
                this.toastService.show('top-right', 'success', resp.msg, resp.resp?.idFichaClinica);
                this.router.navigate(['sitio','fichas','lista']);
            } else {
                this.toastService.show('top-right', 'error', resp.msg, resp.resp);
            }
        }
    }

    getFechaHora(obj: any): IFichaClinica {
        // obj.fechaCadena = this.stringDate.inverse(obj.fechaCadena).replace(/-/g, '');
        obj.idCliente = {idPersona: obj.idCliente?.idPersona}
        obj.idEmpleado = {idPersona: obj.idEmpleado?.idPersona}
        return obj;
    }

    async pasteCliente(obj: ICliente): Promise<void> {
        this.ficha.get('idCliente')?.setValue(obj);
        this.ficha.get('cliente_nombre')?.setValue(`${obj?.nombre?obj.nombre:''} ${obj?.apellido?obj?.apellido:''}`);
    }

    async pasteEmpleado(obj: IUsuario): Promise<void> {
        this.ficha.get('idEmpleado')?.setValue(obj);
        this.ficha.get('empleado_nombre')?.setValue(`${obj?.nombre?obj.nombre:''} ${obj?.apellido?obj?.apellido:''}`);
    }

    async pasteTipoProducto(obj: ITipoProducto): Promise<void> {
        this.ficha.get('idTipoProducto')?.setValue(obj)
        this.ficha.get('subcategoria_nombre')?.setValue(`${obj?.descripcion?obj.descripcion:''}`);
        // this.ficha.get('subcategoria')?.setValue('');
        // if (obj) {
        //     this.ficha.get('subcategoria')?.enable();
        // } else {
        //     this.ficha.get('subcategoria')?.disable();
        // }
    }

    async getServicios(): Promise<void> {
        const filter = {
            idFichaClinica: {
                idFichaClinica: this.ficha.value.idFichaClinica
            }
        }
        const resp = await this.serviciosService.getAll(filter);
        if (resp.ok) {
            const source = resp.resp;
            this.source = source;
        }
    }

    async navigateTo(row: IServicio): Promise<void> {
        await this.router.navigate([`/sitio/servicios/${row.idServicio}`]);
    }
}
