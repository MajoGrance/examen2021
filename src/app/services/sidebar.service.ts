import { Injectable } from '@angular/core';
import {
    ANCHO_MENU_CERRADO,
    ANCHO_MENU_ABIERTO
} from '../shared/global';

@Injectable({
    providedIn: 'root'
})
export class SidebarService {
    /**
     * Indica si el menu sidebar debe mostrarse o no.
     */
    showMenu = false;
    /**
     * Indica si se utiliza la agrupacion por modulos.
     */
    modulesMenu = false;

    /**
     * Ancho actual del sidebar.
     */
    get sidebarWidth(): number {
        if (this.showMenu) {
            return ANCHO_MENU_ABIERTO;
        } else  {
            return ANCHO_MENU_CERRADO;
        }
    }

    constructor() { }

    /**
     * Alterna el valor de showMenu.
     */
    toogleMenu(): void {
        if (this.showMenu) {
            this.showMenu = false;
        } else {
            this.showMenu = true;
        }
    }

    /**
     * Indica que el menú debe cerrarse, asignando falso a showMenu.
     */
    closeMenu(): void {
        this.showMenu = false;
    }

    /**
     * Indica que el menú debe abrirse, asignando verdadero a showMenu.
     */
    openMenu(): void {
        this.showMenu = true;
    }
}
