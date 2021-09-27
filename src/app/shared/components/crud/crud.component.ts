import { Component, Input, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit, Type } from '@angular/core';
import { TableColumn } from '../../interfaces';
import { LoadingService } from '../../../services/loading.service';
import { ToastService } from '../../../services/toast.service';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MenuItems } from '../../../pages/pages-menu';
import { MensajesService } from '../../../services/mensajes.service';

@Component({
    selector: 'app-crud',
    templateUrl: './crud.component.html',
    styleUrls: ['./crud.component.scss']
})
export class CRUDComponent implements OnInit, AfterViewInit {
    /**
     * Configuracion de columnas.
     */
    @ViewChild('dt', {static: false}) dt!: Table;
     /**
     * Configuracion de columnas.
     */
    @ViewChild('searchInput', {static: false}) searchInput!: ElementRef;
    /**
     * Configuracion de columnas.
     */
    @Input() columns: TableColumn[] = [];
    /**
     * Configuracion de columnas.
     */
    @Input() title!: string;
    /**
     * Servicio a utilizarse para la consulta de datos
     */
    @Input() service!: any;
    @Input() filtersValid!: boolean;
    /**
     * Url base del registro, utilizado para redireccionar a la ventana de nuevo registro o
     * editar registro.
     */
    @Input() url!: any;
    /**
     * Url base del registro, utilizado para redireccionar a la ventana de nuevo registro o
     * editar registro.
     */
    @Input() idField!: string;
    /**
     * Clase del registro correspondiente a la lista.
     */
    @Input() model!: Type<any>;
    @Input() filtros!: any;
    /**
     * Filas seleccionadas por el usuario.
     */
    selected: any[] = [];
    /**
     * Lista de todos los registros a mostrarse.
     */
    source: any[] = [];
    /**
     * Ancho de la pantalla del dispositivo en el que corre el sistema en px.
     */
    innerWidth = window.innerWidth;
    /**
     * Valor del filtro global.
     */
    filterValue!: string;
    /**
     * Formatos disponibles para exportación de la lista.
     */
    exportarItems: MenuItem[] = [
        {label: 'EXCEL', icon: 'pi pi-file-excel', command: () => {
            this.export('excel');
        }},
        {label: 'CSV', icon: 'pi pi-file-o', command: () => {
            this.export('csv');
        }},
        {label: 'PDF', icon: 'pi pi-file-pdf', command: () => {
            this.export('pdf');
        }},
    ];
    phoneItems = [
        {
            icon: 'pi pi-plus',
            command: () => {
                this.onNew()
            }
        },
        {
            icon: 'pi pi-refresh',
            command: () => {
                this.getData();
            }
        },
        {
            icon: 'pi pi-trash',
            command: () => {
                this.deleteSelected();
            }
        },
        // {
        //     icon: 'pi pi-download',
        //     command: () => {
                
        //     }
        // },
        {
            icon: 'pi pi-search',
            command: () => {
                this.focusSearch();
            }
        }
    ];

    @HostListener('window:resize')
    onResize(): void {
        this.innerWidth = window.innerWidth;
    }

    constructor(
        private loadingService: LoadingService,
        private toastService: ToastService,
        private router: Router,
        private mensajeService: MensajesService
    ) { }

    ngOnInit(): void {
        this.getData();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.getInitialStatus();
        })
    }

    /**
     * Recupera el estado inicial del filtro global y filas seleccionadas.
     */
    getInitialStatus(): void {
        const item = sessionStorage.getItem(this.title);
        if (item) {
            const itemJSON = JSON.parse(item);
            this.filterValue = itemJSON.filters?.global?.value;
            this.selected = itemJSON.selection;
        }
    }

    /**
     * Selecciona todos los registros de la página.
     * @param value valor de seleccion, verdadero o falso.
     * @param dt referencia a la tabla lista.
     */
    selectAll(value: boolean, dt: Table): void {
        const datosAll = dt.value;
        const afectados = datosAll.slice(dt.first, dt.first + dt.rows);
        for (const afectado of afectados) {
            const idx = this.selected.findIndex(value => {
                return value.id === afectado.id && value.empresa_id == afectado.empresa_id;
            })
            if (value) {
                if (!(idx > -1)) {
                    this.selected.push(afectado);
                }
            } else {
                if (idx > -1) {
                    this.selected.splice(idx, 1);
                }
            }
        }
    }

    /**
     * Se posiciona en el campo de search de forma rápida.
     */
    focusSearch(): void {
        this.searchInput.nativeElement.focus();
    }

    /**
     * Consulta los datos al servicio correspondiente.
     */
    async getData(): Promise<void> {
        this.loadingService.setLoading(true);
        if (this.filtros && !this.filtersValid) {
            this.source = [];
            this.loadingService.setLoading(false);
            return;
        }
        const resp = await this.service.getAll(this.filtros);
        if (resp.ok) {
            this.source = resp.resp;
        } else {
            this.toastService.show('top-right', 'error', resp.msg, resp.resp);
        }
        this.loadingService.setLoading(false);
    }

    /**
     * Realiza la conversión necesaria para retornar el valor string
     * del filtro global.
     * @param event evento de filtro global.
     * @returns texto ingresado en el filtro globarl.
     */
    getValue(event: any): string {
        return event.value;
    }

    /**
     * Limpia el valor del filtro global.
     * @param input referencia al input del filtro global.
     * @param dt tabla que contiene la lista de datos.
     */
    clearSearchInput(dt: Table): void {
        this.filterValue = '';
        dt.filterGlobal(this.filterValue, 'contains')
    }

    /**
     * Redirecciona a la página para insertar un nuevo registro.
     */
    async onNew(): Promise<void> {
        const url = `${this.url}/nuevo`;
        await this.router.navigate([url]);
    }

    /**
     * Redirecciona a la página para editar un registro.
     * @param row registro seleccionado para ser editado.
     */
    async onEdit(row: any): Promise<void> {
        const url = `${this.url}/${row[this.idField]}`
        await this.router.navigate([url]);
    }

    /**
     * Exporta la lista a un formato seleccionado.
     * @param format nombre del formato al que se debe exportar la lista.
     */
    async export(format: 'excel' | 'csv' | 'pdf'): Promise<void> {
        if (format === 'excel') {
            this.exportEXCEL();
        } else if (format === 'csv') {
            this.exportCSV();
        } else if (format === 'pdf') {
            this.exportPDF();
        } else {
            this.toastService.show('top-right', 'error', 'Formato inválido', 'Formatos disponibles: EXCEL, CSV y PDF');
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
     * Descarga la lista como se muestra en la tabla en un archivo CSV.
     */
    async exportCSV(): Promise<void> {
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
            });
            const worksheet = xlsx.utils.json_to_sheet(exportData);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'csv', type: 'array' });
            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.csv';
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

    /**
     * Obtiene ícono del modulo en el que estamos posicionados ahora.
     * @returns string correspondiente al icono de material del módulo actual.
     */
    getIcon(): string {
        const modulos = new MenuItems();
        const url = this.router.url;
        for (const mod of modulos.MENU_ITEMS) {
            if (url.indexOf(mod.link) > -1) {
                return mod.icon;
            }
        }
        return '';
    }

    async deleteSelected(): Promise<void> {
        const confirmacion = await this.mensajeService.eliminarRegistros(this.selected);
        if (!confirmacion) {
            return;
        }
        for(const select of this.selected) {
            const resp = await (new this.model().deserialize(select).delete(this.service));
            if (resp.ok) {
                this.selected = []
                this.toastService.show('top-right', 'success', resp.msg, resp.resp);
            } else {
                this.toastService.show('top-right', 'error', resp.msg, resp.resp);
            }
        }
        this.selected = [];
        this.getData();
    }

    async delete(row: any): Promise<void> {
        console.log('entra');
        const confirmacion = await this.mensajeService.eliminarRegistros([row]);
        if (!confirmacion) {
            return;
        }
        const resp = await (new this.model().deserialize(row).delete(this.service));
        if (resp.ok) {
            this.toastService.show('top-right', 'success', resp.msg, resp.resp);
        } else {
            this.toastService.show('top-right', 'error', resp.msg, resp.resp);
        }
        this.selected = [];
        this.getData();
    }
}
