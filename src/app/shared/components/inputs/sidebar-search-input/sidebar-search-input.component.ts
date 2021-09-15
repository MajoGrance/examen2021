import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FilterService } from 'primeng/api';
import { SidebarMenu, SidebarMenuFilter } from '../../../interfaces';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar-search-input',
    templateUrl: './sidebar-search-input.component.html',
    styleUrls: ['./sidebar-search-input.component.scss']
})
export class SidebarSearchInputComponent implements OnInit, OnChanges {
    @Input() control!: AbstractControl;
    @Input() placeholder = 'Escriba aqui...';
    @Input() leftIcon!: string;
    @Input() rightIcon!: string;
    @Input() readonly!: boolean;
    @Input() rightIconTooltip!: string;
    @Input() label = '';
    @Input() groupedMenu: SidebarMenu[] = [];
    @Output() rightIconClick = new EventEmitter();
    @Output() changeValue = new EventEmitter();
    @Output() selectOption = new EventEmitter();
    value = '';
    filteredGroups: any[] = [];
    text = '';
    controlSub!: Subscription;
    errors = {
        required: 'Este campo es requerido',
    };

    constructor(
        private filterService: FilterService,
    ) { }

    ngOnInit(): void {
        this.controlSub = this.control.valueChanges.subscribe({
            next: value => {
                this.value = value;
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.control) {
            if (this.controlSub) {
                try { this.controlSub.unsubscribe() } catch { }
            }
            this.controlSub = this.control.valueChanges.subscribe({
                next: value => {
                    this.value = value;
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
        this.changeValue.emit(value);
    }

    /**
     * Acción a ejecutarse cada que se da click en el icono de la derecha del campo.
     */
    toggleRightIcon(): void {
        this.rightIconClick.emit();
    }

    /**
     * Filtra el menu segun el texto ingresado por el usuario.
     * @param event evento del input al escribir.
     */
    filterGroupedOption(event: any): void {
        const query = event.query;
        const filteredGroups: SidebarMenuFilter[] = [];
        console.log(this.groupedMenu);
        for (const optgroup of this.groupedMenu) {
            let valores = optgroup.children;
            if (!valores) {
                valores = []
            }
            const filteredSubOptions = this.filterService.filter(valores, ['label'], query, 'contains');
            if (filteredSubOptions && filteredSubOptions.length) {
                filteredGroups.push({
                    label: optgroup.label,
                    icon: optgroup.icon,
                    link: optgroup.link,
                    items: filteredSubOptions
                });
            }
        }
        this.filteredGroups = filteredGroups;
    }

    /**
     * Selecciona un menu
     */
    onSelect(event: any): void {
        this.selectOption.emit(event);
    }
}
