import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { TableColumn, ListaInterface } from '../../../shared/interfaces';
import { PresentacionProductoModel } from '../../../models/presentacion-producto.model';
import { PresentacionProductoService } from '../../../services/abm/presentacion-producto.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipoProductoModel } from '../../../models/tipo-producto';
import { CategoriaModel } from '../../../models/categoria.model';
import { TipoProductoService } from '../../../services/abm/tipo-producto.service';
import { CRUDComponent } from '../../../shared/components/crud/crud.component';

@Component({
    selector: 'app-presentacion-producto-lista',
    templateUrl: './presentacion-producto-lista.component.html',
    styleUrls: ['./presentacion-producto-lista.component.scss']
})
export class PresentacionProductoListaComponent implements OnInit, ListaInterface {
    @ViewChild('crud', {static: false}) crud!: CRUDComponent;
    /**
     * Nombre del registro.
     */
    title = "Tipos de Servicios";
    /**
     * Lista de configuraciones de las columnas del registro.
     */
    columns: TableColumn[] = [
        { header: 'ID', type: 'id', field: 'idPresentacionProducto', filterType: 'numeric' },
        { header: 'Nombre', type: 'text', field: 'nombre', filterType: 'text' },
        { header: 'Producto ID', type: 'id', field: 'idProducto', refName: 'idProducto', refField: 'idProducto', filterType: 'numeric' },
        { header: 'Producto Desc.', type: 'text', field: 'idProducto.desc', refName: 'idProducto', refField: 'descripcionGeneral',
            filterType: 'text' },
    ]
    /**
     * Url base del registro.
     */
    url = '/sitio/presentacion-productos';
    /**
     * Nombre del campo correspondiente al id del registro.
     */
    idField = 'idPresentacionProducto';
    /**
     * Clase del modelo correspondiente al registro.
     */
    model: Type<any> = PresentacionProductoModel;
    tipoProductoModel: Type<any> = TipoProductoModel;
    filtrosForm: FormGroup = this.fb.group({
        subcategoria: ['', Validators.required],
        nombre: ['']
    });

    get filtros(): any {
        const obj = this.filtrosForm.value;
        const ret: any = {
            idProducto: {
                idTipoProducto: {
                    idTipoProducto: Number(obj.subcategoria)
                }
            },
        }
        if (obj.nombre) {
            ret.nombre = obj.nombre
        }
        return ret;
    }
    
    constructor(
        public service: PresentacionProductoService,
        private fb: FormBuilder,
        public tipoProductoService: TipoProductoService
    ) { }
    
    ngOnInit(): void { }

    getSource(): void {
        this.filtrosForm.markAllAsTouched();
        this.crud.getData();
    }
}
