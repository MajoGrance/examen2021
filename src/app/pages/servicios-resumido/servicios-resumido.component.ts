import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';
import { UsuariosService } from '../../services/abm/usuario.service';
import { ClienteService } from '../../services/abm/cliente.service';
import { ClienteModel } from '../../models/cliente.model';
import { TableColumn } from '../../shared/interfaces';
import { ServicioService } from '../../services/abm/servicio.service';
import { StringDatePipe } from '../../pipes/stringDate.pipe';
import { ToastService } from '../../services/toast.service';

import { LoadingService } from '../../services/loading.service';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
    selector: 'app-servicios-resumido',
    templateUrl: './servicios-resumido.component.html',
    styleUrls: ['./servicios-resumido.component.scss'],
    providers: [StringDatePipe]
})
export class ServiciosResumidoComponent implements OnInit {

    /**
     * Configuracion de columnas.
     */
    @ViewChild('dt', {static: false}) dt!: Table;

    idField: string = 'fechaHora'
    title: string = 'Resumen de Servicios'

    filters: FormGroup = this.fb.group({
        fecha_desde: [new Date(), Validators.required],
        fecha_hasta: [new Date(), Validators.required],
        empleado: [''],
        cliente: [''],
        categoria: [''],
        subcategoria: ['']
    });
    empleadoModel = UsuarioModel;
    clienteModel = ClienteModel;
    columns: TableColumn[] = [
        { header: 'Fecha', type: 'text', field: 'fechaHora', filterType: 'text' },
        { header: 'Nombre Profesional', type: 'text', field: 'nombreProfesional', filterType: 'text' },
        { header: 'Apellido Profesional', type: 'text', field: 'apellidoProfesional', filterType: 'text' },
        { header: 'Nombre Paciente', type: 'text', field: 'nombrePaciente', filterType: 'text' },
        { header: 'Apellido Paciente', type: 'text', field: 'apellidoPaciente', filterType: 'text' },
        { header: 'Presupuesto', type: 'numeric', field: 'presupuesto', filterType: 'numeric' },
        { header: 'Subcategoría', type: 'text', field: 'subcategoria', filterType: 'text' },
    ]

    source: any[] = [];
    
    constructor(
        private fb: FormBuilder,
        private stringDate: StringDatePipe,
        private toastService: ToastService,
        private loadingService: LoadingService,
        public empleadoService: UsuariosService,
        public clienteService: ClienteService,
        public servicioService: ServicioService,
    ) { }

    ngOnInit(): void {
    }

    async getSource(): Promise<void> {
        const filters = await this.getServicioFilters();
        const resp = await this.servicioService.getAll(filters)
        if (resp.ok) {
            this.source = [];
            const servicios = resp.resp;
            for (const servicio of servicios) {
                const data = {
                    fechaHora: servicio?.fechaHora,
                    nombreProfesional: servicio?.idEmpleado?.nombre,
                    apellidoProfesional: servicio?.idEmpleado?.apellido,
                    nombrePaciente: servicio?.idFichaClinica?.idCliente?.nombre,
                    apellidoPaciente: servicio?.idFichaClinica?.idCliente?.apellido,
                    presupuesto: servicio?.presupuesto,
                    subcategoria: `${ servicio?.idFichaClinica?.idTipoProducto?.idTipoProducto } - ${ servicio?.idFichaClinica?.idTipoProducto?.descripcion }`
                }
                this.source.push(data)
            }
        } else {
            this.toastService.show('top-right', 'error', resp.msg, resp.resp);
        }
    }

    async getServicioFilters() {
        const filters: any = {
            fechaDesdeCadena: this.stringDate.inverse(this.filters?.value?.fecha_desde).replace(/-/g, ''),
            fechaHastaCadena: this.stringDate.inverse(this.filters?.value?.fecha_hasta).replace(/-/g, '')
        };
        if (this.filters.value.cliente) {
            filters.idFichaClinica = {"idCliente": {"idPersona": this.filters.value.cliente}};
        }
        if (this.filters.value.empleado) {
            filters.idEmpleado = {"idPersona": Number(this.filters.value.empleado)};
        }
        return filters;
    }

    exportarItems: MenuItem[] = [
        {label: 'EXCEL', icon: 'pi pi-file-excel', command: () => {
            this.export('excel');
        }},
        {label: 'PDF', icon: 'pi pi-file-pdf', command: () => {
            this.export('pdf');
        }},
    ];

    /**
     * Exporta la lista a un formato seleccionado.
     * @param format nombre del formato al que se debe exportar la lista.
     */
    async export(format: 'excel' | 'pdf'): Promise<void> {
        if (format === 'excel') {
            this.exportEXCEL();
        } else if (format === 'pdf') {
            this.exportPDF();
        } else {
            this.toastService.show('top-right', 'error', 'Formato inválido', 'Formatos disponibles: EXCEL y PDF');
        }
    }

    /**
     * Descarga la lista como se muestra en la tabla en un archivo EXCEL.
     */
    async exportEXCEL(): Promise<void> {
        import("xlsx").then(xlsx => {
            this.loadingService.setLoading(true);
            const sourceCopy: any[] = [];
            this.dt.value.forEach(val => {
                if (this.dt.filteredValue) {
                    const obj = this.dt.filteredValue.find(filterVal => val[this.idField] === filterVal[this.idField]);
                    if (obj) {
                        sourceCopy.push(Object.assign({}, val));
                    }
                } else {
                    sourceCopy.push(Object.assign({}, val));
                }
            });
            const exportData = sourceCopy.map((obj: any) => {
                const columns = this.columns.map(colum => colum.field);
                for (const col of Object.keys(obj)) {
                    if (!(columns.indexOf(col) > -1)) {
                        delete obj[col];
                    }
                }
                return obj;
            })
            const worksheet = xlsx.utils.json_to_sheet(exportData);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.xlsx';
            const data: Blob = new Blob([excelBuffer], {
                type: EXCEL_TYPE
            });
            FileSaver.saveAs(data, this.title + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            this.loadingService.setLoading(false);
        });
    }

    /**
     * Descarga la lista como se muestra en la tabla en un archivo PDF.
     */
    async exportPDF(): Promise<void> {
        this.loadingService.setLoading(true);
        const columnsCopy: any[] = [];
        this.columns.forEach(val => columnsCopy.push(Object.assign({}, val)));
        const exportColumns = this.columns.map(col => ({title: col.header, dataKey: col.field}));
        const sourceCopy: any[] = [];
        this.dt.value.forEach(val => {
            if (this.dt.filteredValue) {
                const obj = this.dt.filteredValue.find(filterVal => val[this.idField] === filterVal[this.idField]);
                if (obj) {
                    sourceCopy.push(Object.assign({}, val));
                }
            } else {
                sourceCopy.push(Object.assign({}, val));
            }
        });
        const exportSource = sourceCopy.map( source => exportColumns.map(exportCol => source[exportCol.dataKey]));
        const doc = new jsPDF('p', 'px', 'a4');
        autoTable(doc, {head: [exportColumns],
                        body: exportSource,
                        showHead: 'everyPage' });
        doc.text(this.title, 30, 25);
        doc.save(`${this.title + '_export_' + new Date().getTime()}.pdf`);
        this.loadingService.setLoading(false);
    }
}
