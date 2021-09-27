import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { ListaInterface, TableColumn } from '../../../shared/interfaces';
import { PacienteModel } from '../../../models/pacientes.model';
import { PacienteService } from '../../../services/abm/paciente-producto.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CRUDComponent } from '../../../shared/components/crud/crud.component';

@Component({
    selector: 'app-pacientes-lista',
    templateUrl: './pacientes-lista.component.html',
    styleUrls: ['./pacientes-lista.component.scss']
})
export class PacientesListaComponent implements OnInit, ListaInterface {
    @ViewChild('crud', {static: false}) crud!: CRUDComponent;
    /**
     * Nombre del registro.
     */
    title = "Pacientes";
    /**
     * Lista de configuraciones de las columnas del registro.
     */
    columns: TableColumn[] = [
        { header: 'Cédula', type: 'text', field: 'cedula', filterType: 'text' },
        { header: 'Nombre', type: 'text', field: 'nombre', filterType: 'text' },
        { header: 'Apellido', type: 'text', field: 'apellido', filterType: 'text' },
        { header: 'telefono', type: 'text', field: 'telefono', filterType: 'text' },
        { header: 'email', type: 'text', field: 'email', filterType: 'text' },
        { header: 'ruc', type: 'text', field: 'ruc', filterType: 'text' },
        { header: 'Fecha de Nacimiento', type: 'date', field: 'fechaNacimiento', filterType: 'date' },
    ]
    /**
     * Url base del registro.
     */
    url = '/sitio/pacientes';
    /**
     * Nombre del campo correspondiente al id del registro.
     */
    idField = 'idPersona';
    /**
     * Clase del modelo correspondiente al registro.
     */
    model: Type<any> = PacienteModel;
    filtrosForm: FormGroup = this.fb.group({
        apellido: [''],
        nombre: ['']
    });

    get filtros(): any {
        const obj = this.filtrosForm.value;
        const ret: any = {};
        if (obj.apellido) {
            ret.apellido = obj.apellido;
        }
        if (obj.nombre) {
            ret.nombre = obj.nombre;
        }
        return ret;
    }
    
    constructor(
        public service: PacienteService,
        private fb: FormBuilder
    ) { }
    
    ngOnInit(): void { }

    getSource(): void {
        this.filtrosForm.markAllAsTouched();
        this.crud.getData();
    }
}
