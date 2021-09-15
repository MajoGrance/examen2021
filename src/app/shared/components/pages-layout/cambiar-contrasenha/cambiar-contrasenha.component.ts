import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-cambiar-contrasenha',
    templateUrl: './cambiar-contrasenha.component.html',
    styleUrls: ['./cambiar-contrasenha.component.scss']
})
export class CambiarContrasenha implements OnInit {
    @Input() display = false;
    @Input() nuevo = false;
    @Input() form!: FormGroup;
    @Output() displayChange = new EventEmitter();
    @Output() confirmChanges = new EventEmitter();

    constructor() { }

    ngOnInit(): void { }

    setDisplay(value: boolean): void {
        this.display = value;
        this.displayChange.emit(this.display);
    }

    confirm(): void {
        if (this.form.valid) {
            this.confirmChanges.emit(this.form);
        }
    }
}
