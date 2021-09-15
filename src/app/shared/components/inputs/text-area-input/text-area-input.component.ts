import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-text-area-input',
    templateUrl: './text-area-input.component.html',
    styleUrls: ['./text-area-input.component.scss']
})
export class TextAreaInputComponent implements OnInit, OnChanges {
    @Input() control!: AbstractControl;
    @Input() placeholder = 'Escriba aqui...';
    @Input() noPadding!: boolean;
    @Input() readonly!: boolean;
    @Input() label = '';
    @Input() minFractionDigits = 1;
    @Input() maxFractionDigits = 6;
    @Output() rightIconClick = new EventEmitter();
    @Output() changeValue = new EventEmitter();
    @Output() clickInput = new EventEmitter();
    @Output() clickReference = new EventEmitter();
    model!: Date;
    errors = {
        required: 'Este campo es requerido',
        pattern: 'Valor inválido',
    };

    constructor() { }

    ngOnInit(): void {
        this.model = this.control?.value;
        this.control.valueChanges.subscribe({
            next: () => {
                this.model = this.control?.value;
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.control) {
            this.model = this.control?.value;
            this.control.valueChanges.subscribe({
                next: () => {
                    this.model = this.control?.value;
                }
            });
        }
    }

    checkCero(): void {
        this.control?.markAllAsTouched();
        if (!this.control.value) {
            this.control.setValue(0);
        }
    }

    /**
     * Acción a ejecutarse cada que se edita el campo.
     * @param value nuevo valor a asignarse al control del formulario.
     */
    change(): void {
        this.control.setValue(this.model);
        this.changeValue.emit(this.model);
    }

    /**
     * Acción a ejecutarse cada que se da click en el icono de la derecha del campo.
     */
    onClickInput(): void {
        this.clickInput.emit();
    }
}
