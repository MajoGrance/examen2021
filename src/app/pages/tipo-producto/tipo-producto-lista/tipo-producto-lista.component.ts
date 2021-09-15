import { Component, OnInit, Type } from '@angular/core';
import { TableColumn } from '../../../shared/interfaces';
import { TipoProductoModel } from '../../../models/tipo-producto';
import { TipoProductoService } from '../../../services/abm/tipo-producto.service';

@Component({
    selector: 'app-tipo-producto-lista',
    templateUrl: './tipo-producto-lista.component.html',
    styleUrls: ['./tipo-producto-lista.component.scss']
})
export class TipoProductoListaComponent implements OnInit {
    /**
     * Nombre del registro.
     */
    title = "Sub categorías";
    /**
     * Lista de configuraciones de las columnas del registro.
     */
    columns: TableColumn[] = [
        { header: 'ID', type: 'id', field: 'idTipoProducto', filterType: 'numeric' },
        { header: 'Descripción', type: 'text', field: 'descripcion', filterType: 'text' },
        { header: 'Categoría ID', type: 'text', field: 'idCategoria', refName: 'idCategoria', refField: 'idCategoria', filterType: 'text' },
        { header: 'Categoría Desc.', type: 'text', field: 'idCategoria.desc', refName: 'idCategoria', refField: 'descripcion',
            filterType: 'text' },
    ]
    /**
     * Url base del registro.
     */
    url = '/sitio/sub-categorias';
    /**
     * Nombre del campo correspondiente al id del registro.
     */
    idField = 'idTipoProducto';
    /**
     * Clase del modelo correspondiente al registro.
     */
    model: Type<any> = TipoProductoModel;
    
    constructor(
        public service: TipoProductoService
    ) { }
    
    ngOnInit(): void { }
}
