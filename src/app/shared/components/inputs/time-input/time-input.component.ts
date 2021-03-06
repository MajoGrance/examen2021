import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TimePipe } from '../../../../pipes/time.pipe';

@Component({
    selector: 'app-time-input',
    templateUrl: './time-input.component.html',
    styleUrls: ['./time-input.component.scss'],
    providers: [TimePipe]
})
export class TimeInputComponent implements OnInit {
    @Input() control!: AbstractControl;
    @Input() placeholder = 'hh:mm';
    @Input() leftIcon!: string;
    @Input() noPadding!: boolean;
    @Input() readonly!: boolean;
    @Input() showTime!: boolean;
    @Input() label = '';
    @Input() minFractionDigits = 1;
    @Input() maxFractionDigits = 6;
    @Output() changeValue = new EventEmitter();
    @Output() clickInput = new EventEmitter();
    @Output() clickReference = new EventEmitter();
    aux: any;
    model!: string | null;
    errors = {
        required: 'Este campo es requerido',
        pattern: 'Valor inválido',
    };

    constructor(
        private timePipe: TimePipe
    ) { }

    ngOnInit(): void {
        if (this.control?.value) {
            if (this.control.value.length === 4) {
                this.model = `${this.timePipe.transform(this.control.value)}`;
            } else {
                this.model = this.control.value;
            }
        } else {
            this.model = null
        }
        this.control.valueChanges.subscribe({
            next: () => {
                if (this.control.value) {
                    if (this.control.value.length === 4) {
                        this.model = `${this.timePipe.transform(this.control.value)}`;
                    } else {
                        this.model = this.control.value;
                    }
                }
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.control) {
            if (this.control?.value) {
                if (this.control.value.length === 4) {
                    this.model = `${this.timePipe.transform(this.control.value)}`;
                } else {
                    this.model = this.control.value;
                }
            } else {
                this.model = null;
            }
            this.control.valueChanges.subscribe({
                next: () => {
                    if (this.control.value) {
                        if (this.control.value.length === 4) {
                            this.model = `${this.timePipe.transform(this.control.value)}`;
                        } else {
                            this.model = this.control.value;
                        }
                    }
                }
            });
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
