import { Component, OnInit, Type } from '@angular/core';
import { VentanaInterface } from '../../../shared/interfaces';
import { CategoriaModel, ICategoria } from '../../../models/categoria.model';
import { FormGroup } from '@angular/forms';
import { CategoriaService } from '../../../services/abm/categoria.service';
import { MensajesService } from '../../../services/mensajes.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-categoria-ventana',
    templateUrl: './categoria-ventana.component.html',
    styleUrls: ['./categoria-ventana.component.scss']
})
export class CategoriaVentanaComponent implements OnInit, VentanaInterface {
    /**
    * Nombre del registro.
    */
    name = `Categoría`;
    /**
     * Nombre del registro.
     */
    title = `Categoría`;
    /**
     * Nombre del registro.
     */
    titleField = 'idCategoria';
    /**
     * Url base del registro.
     */
    url = '/sitio/categorias';
    /**
     * Indicador de edición del formulario.
     */
    editando = false;
    /**
     * Indicador de que el formulario corresponde a un registro nuevo.
     */
    nuevo = true;
    /**
     * Indicador de que el formulario se ha modificado.
     */
    modificado = false;
    /**
     * Clase del modelo correspondiente al registro.
     */
    model: Type<any> = CategoriaModel;
    /**
     * Objeto inicial del formulario.
     */
    object!: ICategoria;
    /**
     * Nombre del registro.
     */
    formGroup: FormGroup = new this.model().getFormGroup();

    constructor(
        public service: CategoriaService,
        private mensajeService: MensajesService,
        private location: Location,
    ) { }

    ngOnInit(): void { }

    /**
     * Determina si se puede desactivar la página.
     * @param currentRoute Contiene la información sobre una ruta asociada al componente, cargado en el outlet.
     * @param currentState Estado actual de la ruta en el navegador.
     * @param nextState Estado siguiente de la ruta en el navegador si se permitiera redireccionar.
     */
    canDeactivate(currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Promise<boolean> | boolean {
        if (!this.editando) {
            return true;
        } else {
            return new Promise((resolve) => {
                if (this.modificado) {
                    this.mensajeService.descartarCambios().then(confirmacion => {
                        if (confirmacion) {
                            resolve(true);
                        } else {
                            resolve(false);
                            this.location.go(currentState.url);
                        }
                    });
                } else {
                    resolve(true);
                }
            });
        }
    }
}
