import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-key-input',
    templateUrl: './key-input.component.html',
    styleUrls: ['./key-input.component.scss']
})
export class KeyInputComponent implements OnInit, OnChanges {
    @Input() control!: AbstractControl;
    @Input() placeholder = 'Escriba aqui...';
    @Input() leftIcon!: string;
    @Input() noPadding!: boolean;
    @Input() readonly!: boolean;
    @Input() label = '';
    model = '';
    /**
     * Tipo del input correspondiente a la contraseña es text cuando es visible, password cuando no.
     */
    passwordType = 'password';
    errors = {
        required: 'Este campo es requerido',
        pattern: 'Ingrese al menos 8 caracteres, 1 número, 1 minúscula, 1 mayúscula y 1 caracter especial',
        diff: 'Las contraseñas no son iguales',
        maxLenght: 'Excede la longitud máxima', 
    };

    get icon(): string {
        if (this.passwordType === 'text') {
            return 'pi pi-eye';
        }
        return 'pi pi-eye-slash'
    }

    constructor() { }

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
    }

    toggleVisibility(): void {
        if (this.passwordType === 'text') {
            this.passwordType = 'password';
        } else {
            this.passwordType = 'text';
        }
    }
}
