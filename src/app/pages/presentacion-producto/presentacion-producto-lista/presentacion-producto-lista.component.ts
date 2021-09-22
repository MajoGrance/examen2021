import { Component, OnInit, Type } from '@angular/core';
import { TableColumn, ListaInterface } from '../../../shared/interfaces';
import { PresentacionProductoModel } from '../../../models/presentacion-producto.model';
import { PresentacionProductoService } from '../../../services/abm/presentacion-producto.service';

@Component({
    selector: 'app-presentacion-producto-lista',
    templateUrl: './presentacion-producto-lista.component.html',
    styleUrls: ['./presentacion-producto-lista.component.scss']
})
export class PresentacionProductoListaComponent implements OnInit, ListaInterface {
    /**
     * Nombre del registro.
     */
    title = "Presentación Producto";
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
    
    constructor(
        public service: PresentacionProductoService
    ) { }
    
    ngOnInit(): void { }

}
