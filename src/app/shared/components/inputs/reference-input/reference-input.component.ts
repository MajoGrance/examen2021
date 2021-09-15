import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, ViewChild, ElementRef, HostListener, Type } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { LoadingService } from '../../../../services/loading.service';
import { TableColumn } from '../../../interfaces';
import { Table } from 'primeng/table';
import { ToastService } from '../../../../services/toast.service';

@Component({
    selector: 'app-reference-input',
    templateUrl: './reference-input.component.html',
    styleUrls: ['./reference-input.component.scss']
})
export class ReferenceInputComponent implements OnInit {
    @ViewChild('input', {static: false}) input!: ElementRef;
    @Input() control!: AbstractControl;
    @Input() placeholder = 'Escriba aqui...';
    @Input() name = '';
    @Input() readonly!: boolean;
    @Input() noPadding!: boolean;
    @Input() label = '';
    @Input() service: any;
    @Input() clase!: any;
    @Input() icon = 'pi pi-search';
    @Input() idField = 'id';
    @Output() changeValue = new EventEmitter();
    @Output() paste = new EventEmitter();
    errors = {
        maxLenght: 'Excede la longitud máxima', 
        required: 'Este campo es requerido',
        pattern: 'Formato inválido',
    };
    model!: string;
    filterValue = '';
    display = false;
    source: any[] = [];
    columns: TableColumn[] = [];
    /**
     * Ancho de la pantalla del dispositivo en el que corre el sistema en px.
     */
    innerWidth = window.innerWidth;
    pasteObj: any = {};

    @HostListener('window:resize')
    onResize(): void {
        this.innerWidth = window.innerWidth;
    }

    constructor(
        private loadingService: LoadingService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.control.setValue(this.control?.value);
        this.model = this.control?.value;
        this.control.valueChanges.subscribe({
            next: () => {
                this.model = this.control?.value;
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.control) {
            this.control.setValue(this.control?.value);
            this.model = this.control?.value;
            this.control.valueChanges.subscribe({
                next: () => {
                    this.model = this.control?.value;
                }
            });
        }
    }

    /**
     * Acción a ejecutarse cada que se edita el campo.
     * @param value nuevo valor a asignarse al control del formulario.
     */
    change(value: any): void {
        this.control.setValue(value);
        this.changeValue.emit(value);
    }

    /**
     * Acción a ejecutarse al abrir la referencia del campo.
     */
    openReference(): void {
        // this.clickReference.emit();
    }

    async onPaste(): Promise<void> {
        const id = this.control?.value;
        if (id) {
            this.loadingService.setLoading(true);
            let service: any;
            if (this.idField !== 'id') {
                service = this.service.getAll();
            } else {
                service = this.service.get(id)
            }
            const resp = await service;
            if (resp.ok) {
                let obj: any;
                if (resp.resp.length) {
                    obj = resp.resp.find((obj: any) => Number(obj[this.idField]) === Number(id));
                }
                this.paste.emit(obj);
            } else {
                this.paste.emit(null);
            }
            this.loadingService.setLoading(false);

        } else {
            this.paste.emit(null);
        }        
    }

    /**
     * Abrea la ventana de busqueda del registro referenciado.
     */
    async openPasteWindow(): Promise<void> {
        this.loadingService.setLoading(true);
        this.columns = new this.clase().getPasteColumns();
        const resp = await this.service.getAll();
        if (resp.ok) {
            this.source = resp.resp;
            this.display = true;
        } else {
            this.toastService.show('top-right', 'error', resp.msg, resp.resp);
        }
        this.loadingService.setLoading(false);
    }

    /**
     * Evento a ejecutarse al seleccionar una fila del paste window.
     */
    async selectRow(row: any): Promise<void> {
        this.input.nativeElement.focus();
        this.control.setValue(row[this.idField]);
        this.display = false;
        this.input.nativeElement.blur();
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
}
