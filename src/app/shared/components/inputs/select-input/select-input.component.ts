import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { AbstractControl } from '@angular/forms';

export interface OptionsInterface {
    valor: any;
    nombre: string;
    children?: any[];
}
@Component({
    selector: 'app-select-input',
    templateUrl: './select-input.component.html',
    styleUrls: ['./select-input.component.scss']
})
export class SelectInputComponent implements OnInit, OnChanges {
    @Input() control!: AbstractControl;
    @Input() placeholder = 'Seleccionar';
    @Input() readonly!: boolean;
    @Input() noPadding!: boolean;
    @Input() options: OptionsInterface[] = [];
    @Input() optionGroupChildren: string[] = [];
    @Input() label = '';
    @Output() changeValue = new EventEmitter()
    value!: any;
    errors = {
        required: 'Este campo es requerido',
    };

    constructor() { }

    ngOnInit(): void {
        this.control.setValue(this.control?.value);
        this.value = this.control?.value;
        this.control.valueChanges.subscribe({
            next: () => {
                this.value = this.control?.value;
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.control) {
            this.control.setValue(this.control?.value);
            this.value = this.control?.value;
            this.control.valueChanges.subscribe({
                next: () => {
                    this.value = this.control?.value;
                }
            });
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
        this.control.setValue(value);
        this.changeValue.emit(value);
    }
}
