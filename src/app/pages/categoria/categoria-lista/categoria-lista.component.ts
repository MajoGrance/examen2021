import { Component, OnInit, Type } from '@angular/core';
import { ListaInterface, TableColumn } from '../../../shared/interfaces';
import { CategoriaService } from '../../../services/abm/categoria.service';
import { CategoriaModel } from '../../../models/categoria.model';

@Component({
    selector: 'app-categoria-lista',
    templateUrl: './categoria-lista.component.html',
    styleUrls: ['./categoria-lista.component.scss']
})
export class CategoriaListaComponent implements OnInit, ListaInterface {
    /**
     * Nombre del registro.
     */
    title = "Categorías";
    /**
     * Lista de configuraciones de las columnas del registro.
     */
    columns: TableColumn[] = [
        { header: 'ID', type: 'id', field: 'idCategoria', filterType: 'numeric' },
        { header: 'Descripción', type: 'text', field: 'descripcion', filterType: 'text' },
    ]
    /**
     * Url base del registro.
     */
    url = '/sitio/categorias';
    /**
     * Nombre del campo correspondiente al id del registro.
     */
    idField = 'idCategoria';
    /**
     * Clase del modelo correspondiente al registro.
     */
    model: Type<any> = CategoriaModel;
    
    constructor(
        public service: CategoriaService
    ) { }
    
    ngOnInit(): void { }

}
