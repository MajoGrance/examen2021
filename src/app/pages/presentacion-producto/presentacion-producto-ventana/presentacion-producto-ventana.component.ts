import { Component, OnInit, Type } from '@angular/core';
import { VentanaInterface } from '../../../shared/interfaces';
import { PresentacionProductoModel, IPresentacionProducto } from '../../../models/presentacion-producto.model';
import { FormGroup } from '@angular/forms';
import { ProductoModel, IProducto } from '../../../models/producto.model';
import { PresentacionProductoService } from '../../../services/abm/presentacion-producto.service';
import { ProductoService } from '../../../services/abm/producto.service';
import { MensajesService } from '../../../services/mensajes.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-presentacion-producto-ventana',
    templateUrl: './presentacion-producto-ventana.component.html',
    styleUrls: ['./presentacion-producto-ventana.component.scss']
})
export class PresentacionProductoVentanaComponent implements OnInit, VentanaInterface {
    /**
    * Nombre del registro.
    */
    name = `Presentación Producto`;
    /**
     * Nombre del registro.
     */
    title = `Presentación Producto`;
    /**
     * Nombre del registro.
     */
    titleField = 'idPresentacionProducto';
    /**
     * Url base del registro.
     */
    url = '/sitio/presentacion-productos';
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
    model: Type<any> = PresentacionProductoModel;
    /**
     * Objeto inicial del formulario.
     */
    object!: IPresentacionProducto;
    /**
     * Nombre del registro.
     */
    formGroup: FormGroup = new this.model().getFormGroup();
    /**
     * Modelo de la referencia a categoria.
     */
    productoModel: Type<any> = ProductoModel;

    constructor(
        public service: PresentacionProductoService,
        public productoService: ProductoService,
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

    pasteProducto(obj: IProducto | null): void {
        this.formGroup.get('idProducto')?.setValue(obj);
        this.formGroup.get('producto_desc')?.setValue(obj?.descripcionGeneral);
    }
}
