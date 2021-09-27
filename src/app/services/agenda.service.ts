import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ServiceResponse } from '../shared/interfaces';
import { connError } from '../shared/global';
import { SeguridadService } from './seguridad.service';

@Injectable({
    providedIn: 'root'
})
export class AgendaService {
    /**
     * Url correspondiente al servicio a consultar.
     */
    url = `${environment.host}/persona`;
    /**
     * Cuerpo de la consulta a ser realizada.
     */
    body: any = {};

    constructor(
        public http: HttpClient,
        public seguridadService: SeguridadService
    ) { }

    /**
     * Obtiene una agenda dado un id y una fecha.
     * @param empleado id del empleado por el que se consulta la agenda.
     * @param fecha fecha de la agenda.
     */
    async get(empleado: number, fecha: string, disponible?: string): Promise<ServiceResponse> {
        try {
            const url = `${this.url}/${empleado}/agenda`;
            const params: any = {
                fecha
            }
            if(disponible) {
                params.disponible = disponible
            }
            const resp = await this.http.get<any>(url, {headers: {}, params: params}).toPromise();
            const ret: ServiceResponse = {
                ok: true,
                msg: 'GET',
                resp: resp,
            };
            return ret;
        } catch (error: any) {
            if (error?.error) {
                const serverError = error.error;
                const ret: ServiceResponse = {
                    ok: false,
                    resp: 'Ha ocurrido un error inesperado',
                    msg: serverError,
                };
                return ret;
            }
            return connError;
        }
    }
}
