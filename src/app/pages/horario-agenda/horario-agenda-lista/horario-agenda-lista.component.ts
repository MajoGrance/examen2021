import { Component, OnInit, Type } from '@angular/core';
import { ListaInterface, TableColumn } from '../../../shared/interfaces';
import { HorarioAgendaModel } from '../../../models/horario-agenda.model';
import { HorarioAgendaService } from '../../../services/abm/horario-agenda.service';

@Component({
    selector: 'app-horario-agenda-lista',
    templateUrl: './horario-agenda-lista.component.html',
    styleUrls: ['./horario-agenda-lista.component.scss']
})
export class HorarioAgendaListaComponent implements OnInit, ListaInterface {
    /**
     * Nombre del registro.
     */
    title = "Horario Agendado";
    /**
     * Lista de configuraciones de las columnas del registro.
     */
    columns: TableColumn[] = [
        { header: 'ID', type: 'id', field: 'idPersonaHorarioAgenda', filterType: 'numeric' },
        { header: 'Día', type: 'option', field: 'dia', filterType: 'text',
            labels: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'] },
        { header: 'Hora apertura', type: 'time', field: 'horaAperturaCadena', filterType: 'text' },
        { header: 'Hora cierre', type: 'time', field: 'horaCierreCadena', filterType: 'text' },
        { header: 'Int. Minutos', type: 'numeric', field: 'intervaloMinutos', filterType: 'numeric' },
        { header: 'Empleado ID', type: 'id', field: 'idEmpleado', refName: 'idEmpleado', refField: 'idPersona', filterType: 'numeric' },
        { header: 'Empleado Nombre.', type: 'text', field: 'idEmpleado.nombre', refName: 'idEmpleado', refField: 'nombre',
            filterType: 'text' },
    ]
    /**
     * Url base del registro.
     */
    url = '/sitio/horario-agenda';
    /**
     * Nombre del campo correspondiente al id del registro.
     */
    idField = 'idPersonaHorarioAgenda';
    /**
     * Clase del modelo correspondiente al registro.
     */
    model: Type<any> = HorarioAgendaModel;
    
    constructor(
        public service: HorarioAgendaService
    ) { }
    
    ngOnInit(): void { }
 
}
