import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { StringDatePipe } from '../../../../pipes/stringDate.pipe';

@Component({
    selector: 'app-date-input',
    templateUrl: './date-input.component.html',
    styleUrls: ['./date-input.component.scss'],
    providers: [StringDatePipe]
})
export class DateInputComponent implements OnInit, OnChanges {
    @Input() control!: AbstractControl;
    @Input() placeholder = 'dd/mm/aaaa';
    @Input() leftIcon!: string;
    @Input() noPadding!: boolean;
    @Input() readonly!: boolean;
    @Input() showTime!: boolean;
    @Input() label = '';
    @Input() minFractionDigits = 1;
    @Input() maxFractionDigits = 6;
    @Output() rightIconClick = new EventEmitter();
    @Output() changeValue = new EventEmitter();
    @Output() clickInput = new EventEmitter();
    @Output() clickReference = new EventEmitter();
    model!: Date | null;
    errors = {
        required: 'Este campo es requerido',
        pattern: 'Valor inválido',
    };

    constructor(
        private stringDate: StringDatePipe
    ) { }

    ngOnInit(): void {
        if (this.control?.value) {
            if (this.control?.value.length === 8) {
                this.model = this.stringDate.transform(this.control.value);
            } else if (this.control?.value.length === 10) {
                const fechaUTC = new Date(this.control.value);
                this.model = new Date(fechaUTC.getUTCFullYear(), fechaUTC.getUTCMonth(), fechaUTC.getUTCDate());
            } else {
                this.model = new Date(this.control?.value);
            }
        } else {
            this.model = null
        }
        this.control.valueChanges.subscribe({
            next: () => {
                if (this.control?.value) {
                    if (this.control?.value.length === 8) {
                        this.model = this.stringDate.transform(this.control.value);
                    } else if (this.control?.value.length === 10) {
                        const fechaUTC = new Date(this.control.value);
                        this.model = new Date(fechaUTC.getUTCFullYear(), fechaUTC.getUTCMonth(), fechaUTC.getUTCDate());
                    } else {
                        this.model = new Date(this.control?.value);
                    }
                } else {
                    this.model = null
                }
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.control) {
            if (this.control?.value) {
                if (this.control?.value.length === 8) {
                    this.model = this.stringDate.transform(this.control.value);
                } else if (this.control?.value.length === 10) {
                    const fechaUTC = new Date(this.control.value);
                    this.model = new Date(fechaUTC.getUTCFullYear(), fechaUTC.getUTCMonth(), fechaUTC.getUTCDate());
                } else {
                    this.model = new Date(this.control?.value);
                }
            } else {
                this.model = null;
            }
            this.control.valueChanges.subscribe({
                next: () => {
                    if (this.control?.value) {
                        if (this.control?.value.length === 8) {
                            this.model = this.stringDate.transform(this.control.value);
                        } else if (this.control?.value.length === 10) {
                            const fechaUTC = new Date(this.control.value);
                            this.model = new Date(fechaUTC.getUTCFullYear(), fechaUTC.getUTCMonth(), fechaUTC.getUTCDate());
                        } else {
                            this.model = new Date(this.control?.value);
                        }
                    } else {
                        this.model = null
                    }
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
