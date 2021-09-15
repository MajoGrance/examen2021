import { Component, OnInit, Type } from '@angular/core';
import { TipoProductoModel, ITipoProducto } from '../../../models/tipo-producto';
import { FormGroup } from '@angular/forms';
import { TipoProductoService } from '../../../services/abm/tipo-producto.service';
import { MensajesService } from '../../../services/mensajes.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Location } from '@angular/common';
import { CategoriaService } from 'src/app/services/abm/categoria.service';
import { ICategoria, CategoriaModel } from '../../../models/categoria.model';

@Component({
    selector: 'app-tipo-producto-ventana',
    templateUrl: './tipo-producto-ventana.component.html',
    styleUrls: ['./tipo-producto-ventana.component.scss']
})
export class TipoProductoVentanaComponent implements OnInit {
    /**
    * Nombre del registro.
    */
    name = `Sub categoría`;
    /**
     * Nombre del registro.
     */
    title = `Sub categoría`;
    /**
     * Nombre del registro.
     */
    titleField = 'idTipoProducto';
    /**
     * Url base del registro.
     */
    url = '/sitio/sub-categorias';
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
    model: Type<any> = TipoProductoModel;
    /**
     * Objeto inicial del formulario.
     */
    object!: ITipoProducto;
    /**
     * Nombre del registro.
     */
    formGroup: FormGroup = new this.model().getFormGroup();
    /**
     * Modelo de la referencia a categoria.
     */
    categoriaModel: Type<any> = CategoriaModel;

    constructor(
        public service: TipoProductoService,
        public categoriaService: CategoriaService,
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

    pasteCategoria(obj: ICategoria | null): void {
        this.formGroup.get('idCategoria')?.setValue(obj);
        this.formGroup.get('categoria_desc')?.setValue(obj?.descripcion);
    }

}
