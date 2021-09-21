import { Component, OnInit, Type } from '@angular/core';
import { PacienteModel, IPaciente } from '../../../models/pacientes.model';
import { FormGroup } from '@angular/forms';
import { PacienteService } from '../../../services/abm/paciente-producto.service';
import { MensajesService } from '../../../services/mensajes.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-pacientes-ventana',
    templateUrl: './pacientes-ventana.component.html',
    styleUrls: ['./pacientes-ventana.component.scss']
})
export class PacientesVentanaComponent implements OnInit {
    /**
    * Nombre del registro.
    */
    name = `Paciente`;
    /**
     * Nombre del registro.
     */
    title = `Paciente`;
    /**
     * Nombre del registro.
     */
    titleField = 'nombre';
    /**
     * Url base del registro.
     */
    url = '/sitio/pacientes';
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
    model: Type<any> = PacienteModel;
    /**
     * Objeto inicial del formulario.
     */
    object!: IPaciente;
    /**
     * Nombre del registro.
     */
    formGroup: FormGroup = new this.model().getFormGroup();

    constructor(
        public service: PacienteService,
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
