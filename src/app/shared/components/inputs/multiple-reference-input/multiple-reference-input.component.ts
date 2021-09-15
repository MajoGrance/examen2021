import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-multiple-reference-input',
  templateUrl: './multiple-reference-input.component.html',
  styleUrls: ['./multiple-reference-input.component.scss']
})
export class MultipleReferenceInputComponent implements OnInit {
    @Input() control!: AbstractControl;
    @Input() placeholder = 'Seleccionar';
    @Input() readonly!: boolean;
    @Input() options: any[] = [];
    @Input() optionGroupChildren: string[] = [];
    @Input() label = '';
    @Input() optionLabel = 'nombre';
    @Input() optionValue = 'id';
    model: any[] = [];
    errors = {
        required: 'Este campo es requerido',
    };

    constructor() { }

    ngOnInit(): void {
        if (this.control?.value) {
            this.model = this.control?.value?.split(',').map((value: string): number => {
                return Number(value)
            });
        } else {
            this.model = [];
        }
        this.control.valueChanges.subscribe({
            next: () => {
                this.model = this.control?.value;
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.control) {
            if (this.control?.value) {
                this.model = this.control?.value?.split(',').map((value: string): number => {
                    return Number(value)
                });
            } else {
                this.model = [];
            }
            if (changes.control) {
                this.model = this.control?.value?.split(',').map((value: string): number => {
                    return Number(value)
                });
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
    }

    /**
     * Obtiene el nombre de una opción dada.
     * @param value nuevo valor a asignarse al control del formulario.
     */
    getSelectedName(id: number): string {
        let label = '';
        const option = this.options.find(obj => obj.id === id);
        if (option) {
            label = option[this.optionLabel];
        }
        return label;
    }
}
