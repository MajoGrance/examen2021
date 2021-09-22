import { Component, OnInit, Type } from '@angular/core';
import { HorarioAgendaModel, IHorarioAgenda } from '../../../models/horario-agenda.model';
import { FormGroup } from '@angular/forms';
import { UsuarioModel, IUsuario } from '../../../models/usuario.model';
import { HorarioAgendaService } from '../../../services/abm/horario-agenda.service';
import { UsuariosService } from '../../../services/abm/usuario.service';
import { MensajesService } from '../../../services/mensajes.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Location } from '@angular/common';
import { OptionsInterface } from '../../../shared/components/inputs/select-input/select-input.component';

@Component({
    selector: 'app-horario-agenda-ventana',
    templateUrl: './horario-agenda-ventana.component.html',
    styleUrls: ['./horario-agenda-ventana.component.scss']
})
export class HorarioAgendaVentanaComponent implements OnInit {
    /**
    * Nombre del registro.
    */
    name = `Horario Agendado`;
    /**
     * Nombre del registro.
     */
    title = `Horario Agendado`;
    /**
     * Nombre del registro.
     */
    titleField = 'idPersonaHorarioAgenda';
    /**
     * Url base del registro.
     */
    url = '/sitio/horario-agenda';
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
    model: Type<any> = HorarioAgendaModel;
    /**
     * Objeto inicial del formulario.
     */
    object!: IHorarioAgenda;
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
    dias: OptionsInterface[] = [
        {valor: 0, nombre: 'Domingo'},
        {valor: 1, nombre: 'Lunes'},
        {valor: 2, nombre: 'Martes'},
        {valor: 3, nombre: 'Miércoles'},
        {valor: 4, nombre: 'Jueves'},
        {valor: 5, nombre: 'Viernes'},
        {valor: 6, nombre: 'Sábado'},
    ];

    constructor(
        public service: HorarioAgendaService,
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
