import { Component, Input, OnInit, Output, EventEmitter, HostListener, Type, OnChanges } from '@angular/core';
import { PasteItemInterface } from '../../../../interfaces';
import { FilterService } from 'primeng/api';

@Component({
    selector: 'app-paste-window',
    templateUrl: './paste-window.component.html',
    styleUrls: ['./paste-window.component.scss']
})
export class PasteWindowComponent implements OnInit {
    @Input() name = '';
    @Input() display!: boolean;
    @Input() source: any[] = [];
    @Input() clase!: Type<any>;
    @Output() selectRow = new EventEmitter();
    @Output() displayChange = new EventEmitter();
    filterValue = '';
    responsiveWidth = '';
    /**
     * Ancho de la pantalla del dispositivo en el que corre el sistema en px.
     */
    innerWidth = window.innerWidth;

    @HostListener('window:resize')
    onResize(): void {
        this.innerWidth = window.innerWidth;
        this.getResponsiveWidth();
    }

    get items(): PasteItemInterface[] {
        let items: PasteItemInterface[] = [];
        if (this.clase) {
            const modelo = new this.clase();
            if (modelo.getPasteItems) {
                items = modelo.getPasteItems(this.source);
            }
        }
        return items;
    }

    get filteredSource(): PasteItemInterface[] | null {
        if (this.filterValue) {
            return this.items.filter(item => {
                if (this.filterService.filters.contains(item.nombre, this.filterValue)) {
                    return true;
                }
                if (this.filterService.filters.contains(item.id, this.filterValue)) {
                    return true;
                }
                if (this.filterService.filters.contains(item.etiqueta, this.filterValue)) {
                    return true;
                }
                if (this.filterService.filters.contains(item.subtexto, this.filterValue)) {
                    return true;
                }
                if (item.descripcion) {
                    for (const desc of item.descripcion) {
                        if (this.filterService.filters.contains(desc.texto, this.filterValue)) {
                            return true;
                        }  
                    }
                }
                return false;
            });
        }
        return null;
    }

    constructor(
        private filterService: FilterService
    ) { }

    ngOnInit(): void {
        this.getResponsiveWidth();
    }

    getResponsiveWidth(): void {
        if (this.innerWidth < 641) {
            this.responsiveWidth = '22rem';
            return;
        } else if (this.innerWidth < 961) {
            this.responsiveWidth = '30rem';
            return;
        }
        this.responsiveWidth = '40rem';
    }

    setDisplay(value: boolean): void {
        this.display = value;
        this.displayChange.emit(this.display);
    }

    /**
     * Limpia el valor del filtro global.
     * @param input referencia al input del filtro global.
     * @param dt tabla que contiene la lista de datos.
     */
    clearSearchInput(): void {
        this.filterValue = '';
        // dt.filterGlobal(this.filterValue, 'contains')
    }

    /**
     * Realiza la conversión necesaria para retornar el valor string
     * del filtro global.
     * @param event evento de filtro global.
     * @returns texto ingresado en el filtro globarl.
     */
    getValue(event: any): string {
        return event.value;
    }

    onSelectRow(row: any): void {
        this.selectRow.emit(row);
    }

}
