import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { StringDatePipe } from 'src/app/pipes/stringDate.pipe';
import { ToastService } from '../../services/toast.service';
import { UsuariosService } from '../../services/abm/usuario.service';
import { ClienteService } from '../../services/abm/cliente.service';
import { PresentacionProductoService } from '../../services/abm/presentacion-producto.service';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { ClienteModel } from 'src/app/models/cliente.model';
import { PresentacionProductoModel } from '../../models/presentacion-producto.model';
import { TableColumn } from 'src/app/shared/interfaces';
import { ServicioDetalleService } from '../../services/abm/servicio-detalle.service';

import { LoadingService } from '../../services/loading.service';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
    selector: 'app-servicios-detallado',
    templateUrl: './servicios-detallado.component.html',
    styleUrls: ['./servicios-detallado.component.scss'],
    providers: [StringDatePipe]
})
export class ServiciosDetalladoComponent implements OnInit {

    /**
     * Configuracion de columnas.
     */
    @ViewChild('dt', {static: false}) dt!: Table;

    idField: string = 'fechaHora'
    title: string = 'Detalle de Servicios'

    filters: FormGroup = this.fb.group({
        fecha_desde: [new Date(), Validators.required],
        fecha_hasta: [new Date(), Validators.required],
        empleado: [''],
        cliente: [''],
        producto: [''],
        categoria: [''],
        subcategoria: ['']
    });
    empleadoModel = UsuarioModel;
    clienteModel = ClienteModel;
    productoModel = PresentacionProductoModel;
    columns: TableColumn[] = [
        { header: 'Fecha', type: 'text', field: 'fechaHora', filterType: 'text' },
        { header: 'Profesional', type: 'text', field: 'profesional', filterType: 'text' },
        { header: 'Paciente', type: 'text', field: 'paciente', filterType: 'text' },
        { header: 'Precio', type: 'numeric', field: 'precio', filterType: 'numeric' },
        { header: 'Cantidad', type: 'numeric', field: 'cantidad', filterType: 'numeric' },
        { header: 'Total', type: 'numeric', field: 'total', filterType: 'numeric' },
        { header: 'Producto', type: 'text', field: 'producto', filterType: 'text' },
    ]

    source: any[] = [];

    constructor(
        private fb: FormBuilder,
        private stringDate: StringDatePipe,
        private toastService: ToastService,
        private loadingService: LoadingService,
        private servicioDetalleService: ServicioDetalleService,
        public empleadoService: UsuariosService,
        public clienteService: ClienteService,
        public productoService: PresentacionProductoService,
    ) { }

    ngOnInit(): void {
    }

    async getSource(): Promise<void> {
        const filters = await this.getServicioFilters()
        const resp = await this.servicioDetalleService.getAll(filters)
        if (resp.ok) {
            this.source = [];
            const servicios = resp.resp;
            for (const servicio of servicios) {
                const data = {
                    fechaHora: servicio?.idServicio?.fechaHora,
                    profesional: servicio?.idEmpleado?.nombreCompleto,
                    paciente: servicio?.idServicio?.idFichaClinica?.idCliente?.nombreCompleto,
                    precio: servicio?.idServicio?.presupuesto,
                    cantidad: servicio?.cantidad,
                    total: 0,
                    producto: servicio?.idPresentacionProducto?.nombre
                }
                this.source.push(data)
            }
        } else {
            this.toastService.show('top-right', 'error', resp.msg, resp.resp);
        }
    }

    async getServicioFilters() {
        const filters: any = {
            idServicio: {
                fechaDesdeCadena: this.stringDate.inverse(this.filters?.value?.fecha_desde).replace(/-/g, ''),
                fechaHastaCadena: this.stringDate.inverse(this.filters?.value?.fecha_hasta).replace(/-/g, '')
            }
        };
        if (this.filters.value.cliente) {
            filters.idServicio.idFichaClinica = {"idCliente": {"idPersona": this.filters.value.cliente}};
        }
        if (this.filters.value.empleado) {
            filters.idServicio.idEmpleado = {"idPersona": Number(this.filters.value.empleado)};
        }
        if ( this.filters.value.producto ) {
            filters.idPresentacionProducto = { "idPresentacionProducto": Number(this.filters.value.producto ) };
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
