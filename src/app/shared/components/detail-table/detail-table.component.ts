import { Component, Input, OnInit, ViewChild, EventEmitter, Output, HostListener, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { TableColumn } from '../../interfaces';
import { ToastService } from '../../../services/toast.service';
import { OptionsInterface } from '../inputs/select-input/select-input.component';

@Component({
    selector: 'app-detail-table',
    templateUrl: './detail-table.component.html',
    styleUrls: ['./detail-table.component.scss']
})
export class DetailTableComponent implements OnInit, OnChanges {
    /**
     * Tabla de datos.
     */
    @ViewChild('dt', {static: false}) dt!: any;
    /**
     * Lista de registros a mostrarse.
     */
    @Input() source: any[] = [];
    /**
     * Columnas de la tabla
     */
    @Input() columns: TableColumn[] = [];
    /**
     * Indicador de que se debe mostrar la cabecera.
     */
    @Input() showHeader = true;
    /**
     * Indicador de que se debe mostrar la cabecera.
     */
    @Input() titleHeader = false;
    @Input() inline = false;
    /**
     * Indicador de que se debe mostrar la cabecera.
     */
    @Input() title!: string;
    /**
     * Clave del registro que se está listando.
     */
    @Input() recordName!: string;
    @Input() formArray!: FormArray;
    /**
     * Evento de creación de un nuevo registro.
     */
    showColumns: TableColumn[] = [];
    /**
     * Cantidad de filas a mostrarse por página.
     */
    rows = 20;
    /**
     * Cantidad de filas a mostrarse por página.
     */
    selectedRows = [];
    /**
     * Ancho de la pantalla del dispositivo en el que corre el sistema.
     */
    innerWidth!: number;
    clonedDetail: any = {};
    /**
     * Valor del campo de filtro.
     */
    @Input() filterValue!: string;
    /**
     * Evento de creación de un nuevo registro.
     */
    @Output() create = new EventEmitter();
    @Output() edit = new EventEmitter();
    @Output() delete = new EventEmitter();
    @Output() blurEvent = new EventEmitter();
    @Output() pasteEvent = new EventEmitter();
    /**
     * Evento de creación de un nuevo registro.
     */
    @Output() clickRow = new EventEmitter();
    @Input() readonly!: boolean;

    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
      this.innerWidth = window.innerWidth;
    }

    get windowSize(): number {
        return window.innerWidth;
    }

    constructor(
        private toastService: ToastService,
    ) { }

    ngOnInit(): void {
        this.selectedRows = [];
        this.innerWidth = window.innerWidth;
        const stateStr = sessionStorage.getItem(this.recordName);
        if (stateStr) {
            const state = JSON.parse(stateStr);
            if (state) {
                this.filterValue = state.filters.global?.value;
            }
        }
        this.showColumns = this.columns.filter(c => c.type !== 'hidden');
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.filterValue) {
            const target = {
                value: this.filterValue,
            };
            this.filterData(target, true);
        }
        if (changes.source) {
            for (const col of this.columns) {
                if (col.type === 'option') {
                    for (const row of this.source) {
                        row[col.field] = col.labels ? col.labels[row[col.field]] : row[col.field];
                    }
                }
            }
        }
    }

    asOptions(labels: string[] | undefined): OptionsInterface[] {
        const options: OptionsInterface[] = [];
        let idx = -1;
        if (labels) {
            for (const lab of labels) {
                idx += 1;
                if (idx === 0) {
                    continue;
                }
                const newObj: OptionsInterface = {
                    valor: idx,
                    nombre: lab
                };
                options.push(newObj);
            }
        }
        return options;
    }

    /**
     * Filtra los datos de forma global.
     * @param target campo del filtro global.
     * @param dt referencia a la tabla html.
     * @param blur indicador de que el evento fue probocado por quitar el focus al campo filtro global.
     */
    filterData(target: any, blur?: boolean): void {
        this.dt?.filterGlobal(target.value, 'contains');
    }

    /**
     * Limpia el valor del filtro local.
     */
    clearFilterData(): void {
        this.filterValue = '';
        this.dt.filterGlobal(this.filterValue, 'contains');
    }

    /**
     * Lanza el evento de creacion de un registro.
     */
    onNew(): void {
        this.create.emit();
    }

    onDelete(dt: any): void {
        for (const form of this.selectedRows) {
            const idx = this.formArray.controls.findIndex(c => c === form);
            if (idx > -1) {
                this.formArray.removeAt(idx);
            }
        }
        this.resetSelected();
        this.delete.emit(this.selectedRows);
    }

    onClickRow(row: any): void {
        this.clickRow.emit(row);
    }

    resetSelected(): void {
        this.selectedRows = [];
    }

    // async pasteField(row: FormGroup, col: any): Promise<void> {
    //     const columnas: TableColumn[] = new col.model().getPasteColumns();
    //     const ref = await this.pasteWindowService.open(col.service, {},
    //         col.header, columnas);
    //     ref.onClose.subscribe({
    //         next: selected => {
    //             if (selected) {
    //                 for (const pField of Object.keys(col.pasteFields)) {
    //                     row.get(pField)?.setValue(selected[col.pasteFields[pField]]);
    //                 }
    //                 if (col.windowPasteFields) {
    //                     for (const pField of Object.keys(col.windowPasteFields)) {
    //                         console.log(pField);
    //                         row.get(pField)?.setValue(selected[col.windowPasteFields[pField]]);
    //                     }
    //                 }
    //             }
    //             this.pasteEvent.emit({row, col});
    //         }
    //     });
    // }

    async pasteReference(row: FormGroup, col: any): Promise<void> {
        if (row.value[col.field]) {
            const resp = await col.service.getAll();
            if (resp.ok) {
                const object = resp.descripcion.find((o: any) => o.codigo === row.value[col.field]);
                if (object) {
                    for (const pField of Object.keys(col.pasteFields)) {
                        row.get(pField)?.setValue(object[col.pasteFields[pField]]);
                    }
                } else {
                    this.toastService.show('top-right', 'error', 'El código no existe', '');
                    for (const pField of Object.keys(col.pasteFields)) {
                        row.get(pField)?.setValue(null);
                    }
                }
            }
        } else {
            for (const pField of Object.keys(col.pasteFields)) {
                row.get(pField)?.setValue(null);
            }
        }
        this.pasteEvent.emit({row, col});
    }

    onBlur(form: FormGroup, fieldname: string): void {
        this.blurEvent.emit({
            fieldname,
            form
        });
    }

    onEdit(detail: FormGroup): void {
        this.edit.emit(detail);
    }

    onRowEditInit(detail: FormGroup, index: number): void {
        const obj = detail.value;
        this.clonedDetail[index] = {...detail.value};
    }

    onRowEditSave(detail: FormGroup, index: number): void {
        if (detail.valid) {
            delete this.clonedDetail[index];
        }
    }

    onRowEditCancel(detail: FormGroup, index: number): void {
        for (const key of Object.keys(this.clonedDetail[index])) {
            const control = detail.get(key);
            control?.setValue(this.clonedDetail[index][key])
        }
        delete this.clonedDetail[index];
    }

    onDeleteRow(form: FormGroup): void {
        const idx = this.formArray.controls.findIndex(c => c === form);
        if (idx > -1) {
            this.formArray.removeAt(idx);
        }
        this.resetSelected();
        this.delete.emit(this.selectedRows);
    }
}
