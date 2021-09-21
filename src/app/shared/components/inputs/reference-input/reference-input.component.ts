import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, ViewChild, ElementRef, HostListener, Type } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { LoadingService } from '../../../../services/loading.service';
import { ToastService } from '../../../../services/toast.service';
import { SeguridadService } from '../../../../services/seguridad.service';

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
    @Input() codigoRegistro = '';
    @Input() funcionFiltro: any;
    @Input() funcionFiltroParent: any;
    @Output() changeValue = new EventEmitter();
    @Output() paste = new EventEmitter();
    errors = {
        maxLenght: 'Excede la longitud máxima', 
        required: 'Este campo es requerido',
        pattern: 'Formato inválido',
    };
    model!: string;
    display = false;
    source: any[] = [];

    constructor(
        private loadingService: LoadingService,
        private toastService: ToastService,
        private seguridadService: SeguridadService,
    ) { }

    ngOnInit(): void {
        this.control.setValue(this.control?.value);
        this.model = this.control?.value;
        this.initField();
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
            this.initField();
            this.control.valueChanges.subscribe({
                next: () => {
                    this.model = this.control?.value;
                }
            });
        }
    }

    async initField(): Promise<void> {
        await this.getSource();
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
            const objetoLista = this.source.find(obj => String(obj[this.idField]) === String(id));
            if (objetoLista) {
                const resp = await this.service.get(id);;
                if (resp.ok) {
                    this.paste.emit(resp.resp);
                } else {
                    this.paste.emit(null);
                }
            } else {
                this.paste.emit(null);
            }
            this.loadingService.setLoading(false);
        } else {
            this.paste.emit(null);
        }   
    }

    async getSource(): Promise<void> {
        let obj: any = {};
        const user = this.seguridadService.getCurrentUser();
        const resp = await this.service.getAll(obj);
        if (resp.ok) {
            const source = resp.resp.filter((obj: any) => {
                let value = true;
                if (obj.hasOwnProperty('activo')) {
                    if (!obj.activo) {
                        value = false;
                    }
                }
                
                return value;
            })
            if (this.funcionFiltro) {
                this.source = this.funcionFiltro(this.funcionFiltroParent, source);
            } else {
                this.source = source;
            }
        } else {
            this.toastService.show('top-right', 'error', resp.msg, resp.resp);
        }
    }

    /**
     * Abrea la ventana de busqueda del registro referenciado.
     */
    async openPasteWindow(): Promise<void> {
        this.loadingService.setLoading(true);
        await this.getSource();
        this.display = true;
        this.loadingService.setLoading(false);
    }

    /**
     * Evento a ejecutarse al seleccionar una fila del paste window.
     */
    async selectRow(row: any): Promise<void> {
        this.input.nativeElement.focus();
        this.control.setValue(row.id);
        this.display = false;
        this.input.nativeElement.blur();
    }
}
