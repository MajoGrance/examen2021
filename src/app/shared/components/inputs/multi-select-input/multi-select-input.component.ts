import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';

export interface OptionsMultiInterface {
    valor: any;
    nombre: string;
    readonly?: boolean;
    children?: any[];
}

@Component({
    selector: 'app-multi-select-input',
    templateUrl: './multi-select-input.component.html',
    styleUrls: ['./multi-select-input.component.scss']
})
export class MultiSelectInputComponent implements OnInit {
    @Input() control!: AbstractControl;
    @Input() placeholder = 'Seleccionar';
    @Input() readonly!: boolean;
    @Input() readonlySearch!: boolean;
    @Input() noPadding!: boolean;
    @Input() options: OptionsMultiInterface[] = [];
    @Input() optionGroupChildren: string[] = [];
    @Input() label = '';
    @Output() changeValue = new EventEmitter()
    model: any[] = [];
    errors = {
        required: 'Este campo es requerido',
    };

    constructor() { }

    ngOnInit(): void {
        if (this.control?.value) {
            this.model = this.control?.value?.split(',');
        } else {
            this.model = [];
        }
        this.control.valueChanges.subscribe({
            next: () => {
                this.model = this.control?.value?.split(',');
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.control) {
            if (this.control?.value) {
                this.model = this.control?.value?.split(',');
            } else {
                this.model = [];
            }
            if (changes.control) {
                this.model = this.control?.value?.split(',');
            }
        }
    }

    markAllAsTouched(): void {
        this.control.markAllAsTouched();
    }

    /**
     * Acción a ejecutarse cada que se edita el campo.
     * @param value nuevo valor a asignarse al control del formulario.
     */
    change(value: any): void {
        this.control.setValue(value.join(','));
        this.changeValue.emit(value.join(','));
        this.markAllAsTouched();
    }

}
