import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { ListaInterface, TableColumn } from '../../../shared/interfaces';
import { HorarioExcepcionModel } from '../../../models/horario-excepcion';
import { HorarioExcepcionService } from '../../../services/abm/horario-excepcion.service';
import { UsuarioModel } from '../../../models/usuario.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CRUDComponent } from '../../../shared/components/crud/crud.component';
import { UsuariosService } from '../../../services/abm/usuario.service';
import { StringDatePipe } from '../../../pipes/stringDate.pipe';

@Component({
    selector: 'app-horarios-excepcion-lista',
    templateUrl: './horarios-excepcion-lista.component.html',
    styleUrls: ['./horarios-excepcion-lista.component.scss'],
    providers: [StringDatePipe]
})
export class HorariosExcepcionListaComponent implements OnInit, ListaInterface {
    @ViewChild('crud', {static: false}) crud!: CRUDComponent;
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
    empleadoModel: Type<any> = UsuarioModel;
    filtrosForm: FormGroup = this.fb.group({
        empleado: [''],
        fecha: [new Date()]
    });

    get filtros(): any {
        const obj = this.filtrosForm.value;
        const ret: any = {};
        if (obj.empleado) {
            ret.idEmpleado = {idPersona: obj.empleado};
        }
        if (obj.fecha) {
            ret.fechaCadena = this.stringDate.inverse(obj.fecha).replace(/-/g, '');
        }
        return ret;
    }
    
    constructor(
        public service: HorarioExcepcionService,
        private fb: FormBuilder,
        public empleadoService: UsuariosService,
        private stringDate: StringDatePipe
    ) { }
    
    ngOnInit(): void { }

    getSource(): void {
        this.filtrosForm.markAllAsTouched();
        this.crud.getData();
    }

    getFilters(): void {
        this.filtrosForm = this.fb.group({
            empleado: [''],
            fecha: ['']
        });
    }
}
