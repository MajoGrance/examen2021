import { Component, Input, EventEmitter, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-boolean-input',
    templateUrl: './boolean-input.component.html',
    styleUrls: ['./boolean-input.component.scss']
})
export class BooleanInputComponent implements OnInit, OnChanges {
    @Input() control!: AbstractControl | undefined;
    @Input() model = false;
    @Input() readonly!: boolean;
    @Input() label = '';
    @Input() htmlLabel = ``;
    @Output() changeValue = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
        this.model = this.control?.value;
        this.control?.valueChanges.subscribe({
            next: () => {
                this.model = this.control?.value;
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.control) {
            this.model = this.control?.value;
            this.control?.valueChanges.subscribe({
                next: () => {
                    this.model = this.control?.value;
                }
            });
        }
        if (changes.model) {
            this.control?.setValue(changes.model.currentValue)
        }
    }

    /**
     * Acción a ejecutarse cada que se edita el campo.
     * @param value nuevo valor a asignarse al control del formulario.
     */
    change(value: boolean): void {
        this.control?.setValue(value);
        this.control?.updateValueAndValidity();
        this.changeValue.emit(value);
    }
}
