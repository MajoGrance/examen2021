import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { ListaInterface, TableColumn } from '../../../shared/interfaces';
import { HorarioAgendaModel } from '../../../models/horario-agenda.model';
import { HorarioAgendaService } from '../../../services/abm/horario-agenda.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CRUDComponent } from '../../../shared/components/crud/crud.component';
import { UsuarioModel } from '../../../models/usuario.model';
import { OptionsInterface } from '../../../shared/components/inputs/select-input/select-input.component';
import { UsuariosService } from '../../../services/abm/usuario.service';

@Component({
    selector: 'app-horario-agenda-lista',
    templateUrl: './horario-agenda-lista.component.html',
    styleUrls: ['./horario-agenda-lista.component.scss']
})
export class HorarioAgendaListaComponent implements OnInit, ListaInterface {
    @ViewChild('crud', {static: false}) crud!: CRUDComponent;
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
    empleadoModel: Type<any> = UsuarioModel;
    filtrosForm: FormGroup = this.fb.group({
        empleado: [''],
        dia: ['']
    });
    dias: OptionsInterface[] = [
        {valor: '', nombre: 'No Filtrar'},
        {valor: 0, nombre: 'Domingo'},
        {valor: 1, nombre: 'Lunes'},
        {valor: 2, nombre: 'Martes'},
        {valor: 3, nombre: 'Miércoles'},
        {valor: 4, nombre: 'Jueves'},
        {valor: 5, nombre: 'Viernes'},
        {valor: 6, nombre: 'Sábado'},
    ];

    get filtros(): any {
        const obj = this.filtrosForm.value;
        const ret: any = {};
        if (obj.empleado) {
            ret.idEmpleado = {idPersona: obj.empleado};
        }
        if (obj.dia !== '') {
            ret.dia = obj.dia;
        }
        return ret;
    }
    
    constructor(
        public service: HorarioAgendaService,
        public empleadoService: UsuariosService,
        private fb: FormBuilder
    ) { }
    
    ngOnInit(): void { }

    getSource(): void {
        this.filtrosForm.markAllAsTouched();
        this.crud.getData();
    }
 
}
