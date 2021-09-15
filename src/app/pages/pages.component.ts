import { Component, OnInit } from '@angular/core';
import { MenuItems } from './pages-menu';

@Component({
    selector: 'app-pages',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
    /**
     * Lista de items del menu.
     */
    menu: any[] = [];
    /**
     * Lista de items del menu.
     */
    modulosMenu: any[] = [];

    constructor( ) { }

    ngOnInit(): void {
        this.getMenu();
    }

    /**
     * Obtiene el menu a mostrarse en el sidebar.
     */
    getMenu(): void {
        const menuItem = new MenuItems();
        this.menu = menuItem.MENU_ITEMS;
        this.modulosMenu = this.menu;
    }
}
