import { Component, OnInit, Type } from '@angular/core';
import { IUsuario, UsuarioModel } from '../../../models/usuario.model';
import { VentanaInterface } from '../../../shared/interfaces';
import { HorarioExcepcionModel, IHorarioExcepcion } from '../../../models/horario-excepcion';
import { FormGroup } from '@angular/forms';
import { OptionsInterface } from '../../../shared/components/inputs/select-input/select-input.component';
import { HorarioExcepcionService } from '../../../services/abm/horario-excepcion.service';
import { UsuariosService } from '../../../services/abm/usuario.service';
import { MensajesService } from '../../../services/mensajes.service';
import { Location } from '@angular/common';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Component({
    selector: 'app-horarios-excepcion-ventana',
    templateUrl: './horarios-excepcion-ventana.component.html',
    styleUrls: ['./horarios-excepcion-ventana.component.scss']
})
export class HorariosExcepcionVentanaComponent implements OnInit, VentanaInterface {
    /**
    * Nombre del registro.
    */
    name = `Horario Excepcional`;
    /**
     * Nombre del registro.
     */
    title = `Horario Excepcional`;
    /**
     * Nombre del registro.
     */
    titleField = 'horarioExcepcion';
    /**
     * Url base del registro.
     */
    url = '/sitio/horario-excepcion';
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
    model: Type<any> = HorarioExcepcionModel;
    /**
     * Objeto inicial del formulario.
     */
    object!: IHorarioExcepcion;
    /**
     * Nombre del registro.
     */
    formGroup: FormGroup = new this.model().getFormGroup();
    /**
     * Modelo de la referencia a categoria.
     */
    empleadoModel: Type<any> = UsuarioModel;
    /**
     * Descripción de valores para los días.
     */
    tipos: OptionsInterface[] = [
        {valor: 'S', nombre: 'Habilitado'},
        {valor: 'N', nombre: 'Deshabilitado'},
    ];

    constructor(
        public service: HorarioExcepcionService,
        public empleadoService: UsuariosService,
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

    pasteEmpleado(obj: IUsuario | null): void {
        this.formGroup.get('idEmpleado')?.setValue(obj);
        this.formGroup.get('empleado_nombre')?.setValue(obj?.nombre);
    }
}
