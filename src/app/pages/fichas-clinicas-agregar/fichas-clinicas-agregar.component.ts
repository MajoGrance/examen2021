import { Component, OnInit, Type } from '@angular/core';
import { StringDatePipe } from '../../pipes/stringDate.pipe';
import { TimePipe } from '../../pipes/time.pipe';
import { FormGroup } from '@angular/forms';
import { FichaClinicaModel, IFichaClinica } from '../../models/ficha-clinica.model';
import { UsuarioModel, IUsuario } from '../../models/usuario.model';
import { ClienteModel, ICliente } from '../../models/cliente.model';
import { UsuariosService } from '../../services/abm/usuario.service';
import { ClienteService } from '../../services/abm/cliente.service';
import { ToastService } from '../../services/toast.service';
import { CopyService } from '../../services/copy.service';
import { CategoriaModel, ICategoria } from 'src/app/models/categoria.model';
import { CategoriaService } from '../../services/abm/categoria.service';
import { TipoProductoService } from '../../services/abm/tipo-producto.service';
import { TipoProductoModel } from 'src/app/models/tipo-producto';
import { FichaClinicaService } from '../../services/abm/ficha-clinica.service';
import { ITipoProducto } from '../../models/tipo-producto';
import { Router } from '@angular/router';

@Component({
    selector: 'app-fichas-clinicas-agregar',
    templateUrl: './fichas-clinicas-agregar.component.html',
    styleUrls: ['./fichas-clinicas-agregar.component.scss'],
    providers: [StringDatePipe, TimePipe]
})
export class FichasClinicasAgregarComponent implements OnInit {
    ficha: FormGroup = new FichaClinicaModel().getFormGroup();
    empleadoModel: Type<any> = UsuarioModel;
    clienteModel: Type<any> = ClienteModel;
    categoriaModel: Type<any> = CategoriaModel;
    tipoProductoModel: Type<any> = TipoProductoModel;
    source: any[] = [];
    innerWidth = window.innerWidth;

    constructor(
        public empleadoService: UsuariosService,
        public clienteService: ClienteService,
        private toastService: ToastService,
        private fichaClinicaService: FichaClinicaService,
        private copyService: CopyService,
        private router: Router,
        public categoriaService: CategoriaService,
        public tipoProductoService: TipoProductoService,
    ) { }

    ngOnInit(): void {
        if ( this.copyService.object && this.copyService.url === 'sitio/fichas/agregar' ) {
            this.ficha.get('idCliente')?.setValue(this.copyService.object.idCliente);
            this.ficha.get('cliente')?.setValue(this.copyService.object.idCliente.idPersona);
            this.pasteCliente(this.copyService.object.idCliente);
            this.ficha.get('idEmpleado')?.setValue(this.copyService.object.idEmpleado);
            this.ficha.get('empleado')?.setValue(this.copyService.object.idEmpleado.idPersona);
            this.pasteEmpleado(this.copyService.object.idEmpleado);
        }
    }

    async save(): Promise<void> {
        this.ficha.markAllAsTouched();
        if (this.ficha.valid && this.ficha?.value) {
            const obj = this.getFechaHora(this.ficha.getRawValue());
            const resp = await this.fichaClinicaService.post(obj);
            if (resp.ok) {
                this.ficha = new FichaClinicaModel().getFormGroup();
                this.toastService.show('top-right', 'success', resp.msg, resp.resp?.idFichaClinica);
                this.router.navigate(['sitio','fichas','lista']);
            } else {
                console.log(resp)
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
}
