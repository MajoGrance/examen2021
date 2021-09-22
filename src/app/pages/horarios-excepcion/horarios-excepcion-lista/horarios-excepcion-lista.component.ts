import { Component, OnInit, Type } from '@angular/core';
import { ListaInterface, TableColumn } from '../../../shared/interfaces';
import { HorarioExcepcionModel } from '../../../models/horario-excepcion';
import { HorarioExcepcionService } from '../../../services/abm/horario-excepcion.service';

@Component({
    selector: 'app-horarios-excepcion-lista',
    templateUrl: './horarios-excepcion-lista.component.html',
    styleUrls: ['./horarios-excepcion-lista.component.scss']
})
export class HorariosExcepcionListaComponent implements OnInit, ListaInterface {
    /**
     * Nombre del registro.
     */
    title = "Horario Excepcional";
    /**
     * Lista de configuraciones de las columnas del registro.
     */
    columns: TableColumn[] = [
        { header: 'ID', type: 'id', field: 'idHorarioExcepcion', filterType: 'numeric' },
        { header: 'Fecha', type: 'stringDate', field: 'fechaCadena', filterType: 'text'},
        { header: 'Hora apertura', type: 'time', field: 'horaAperturaCadena', filterType: 'text' },
        { header: 'Hora cierre', type: 'time', field: 'horaCierreCadena', filterType: 'text' },
        { header: 'Habilitado', type: 'flagBoolean', field: 'flagEsHabilitar', filterType: 'text' },
        { header: 'Int. Minutos', type: 'numeric', field: 'intervaloMinutos', filterType: 'numeric' },
        { header: 'Empleado ID', type: 'id', field: 'idEmpleado', refName: 'idEmpleado', refField: 'idPersona', filterType: 'numeric' },
        { header: 'Empleado Nombre.', type: 'text', field: 'idEmpleado.nombre', refName: 'idEmpleado', refField: 'nombre',
            filterType: 'text' },
    ]
    /**
     * Url base del registro.
     */
    url = '/sitio/horario-excepcion';
    /**
     * Nombre del campo correspondiente al id del registro.
     */
    idField = 'idHorarioExcepcion';
    /**
     * Clase del modelo correspondiente al registro.
     */
    model: Type<any> = HorarioExcepcionModel;
    
    constructor(
        public service: HorarioExcepcionService
    ) { }
    
    ngOnInit(): void { }
}
