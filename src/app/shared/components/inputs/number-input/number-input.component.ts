import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss']
})
export class NumberInputComponent implements OnInit, OnChanges {
    @Input() control!: AbstractControl;
    @Input() placeholder = '0';
    @Input() leftIcon!: string;
    @Input() reference!: boolean;
    @Input() rightIcon!: string;
    @Input() noPadding!: boolean;
    @Input() readonly!: boolean;
    @Input() rightIconTooltip!: string;
    @Input() label = '';
    @Input() minFractionDigits = 1;
    @Input() maxFractionDigits = 6;
    @Output() rightIconClick = new EventEmitter();
    @Output() changeValue = new EventEmitter();
    @Output() clickInput = new EventEmitter();
    @Output() clickReference = new EventEmitter();
    model!: number | null;
    errors = {
        required: 'Este campo es requerido',
        pattern: 'Valor inválido',
    };

    constructor() { }

    ngOnInit(): void {
        this.control.setValue(Number(this.control?.value));
        this.model = this.control?.value;
        this.control.valueChanges.subscribe({
            next: (value) => {
                if (value !== null) {
                    this.model = Number(this.control?.value);
                } else {
                    this.model = null;
                }
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.control) {
            this.control.setValue(Number(this.control?.value));
            this.model = Number(this.control?.value);
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
    change(value: any): void {
        this.control.setValue(value);
        this.changeValue.emit(value);
    }

    /**
     * Acción a ejecutarse cada que se da click en el icono de la derecha del campo.
     */
    toggleRightIcon(): void {
        this.rightIconClick.emit();
    }

    /**
     * Acción a ejecutarse cada que se da click en el icono de la derecha del campo.
     */
    onClickInput(): void {
        this.clickInput.emit();
    }

    /**
     * Acción a ejecutarse al abrir la referencia del campo.
     */
    openReference(): void {
        this.clickReference.emit();
    }

    /**
     * Verifica si el campo tiene valor cero, si es asi limpia el input para que el usuario escriba.
     */
    clearCero(): void {
        if (Number(this.control.value) === 0) {
            setTimeout(() => {
                this.control.setValue(null);
            })
        }
    }
}
