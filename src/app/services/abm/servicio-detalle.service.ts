import { Injectable } from '@angular/core';
import { connError } from 'src/app/shared/global';
import { ServiceResponse } from 'src/app/shared/interfaces';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';
import { SeguridadService } from '../seguridad.service';

const seguridad = new SeguridadService();

@Injectable({
    providedIn: 'root'
})
export class ServicioDetalleService extends BaseService {
    
    url = `${environment.host}/servicio`;
    creadoMsg = 'Detalle servicio creado';
    eliminadoMsg = 'Detalle servicio eliminado';
    editadoMsg = 'Detalle servicio editado';
    deleteFields = ['empleado', 'empleado_nombre', 'cliente', 'cliente_nombre', 'categoria_id', 'categoria_nombre',
        'subcategoria_id', 'subcategoria_nombre', 'ficha_clinica'];
    headers: any = {
        usuario: this.seguridadService.getCurrentUser()?.usuarioLogin
    }

    /**
     * Modifica un objeto de la base de datos.
     * @param id clave primaria del objeto a modificar.
     * @param body objeto que determina que campos deben modificarse y sus nuevos valores.
     */
    async post(body: any, servicio?: number): Promise<ServiceResponse> {
        try {
            this.body = body;
            for (const field of this.deleteFields) {
                delete this.body[field];
            }
            const resp = await this.http.post<any>(`${this.url}/${servicio}/detalle`, this.body, {headers: this.headers}).toPromise();
            const ret: ServiceResponse = {
                ok: true,
                msg: this.creadoMsg,
                resp: resp,
            };
            return ret;
        } catch (error: any) {
            if (error?.error) {
                const serverError = error.error;
                const ret: ServiceResponse = {
                    ok: false,
                    msg: 'Ha ocurrido un error',
                    resp: JSON.stringify(serverError),
                };
                return ret;
            }
            return connError;
        }
    }

    /**
     * Elimina un objeto de la base de datos.
     * @param id clave primaria del objeto a eliminar.
     */
    async delete(id: number, servicio?: number): Promise<ServiceResponse> {
        try {
            const resp = await this.http.delete<any>(`${this.url}/${servicio}/detalle/${id}`, {headers: this.headers}).toPromise();
            const ret: ServiceResponse = {
                ok: true,
                msg: this.eliminadoMsg,
                resp: resp,
            };
            return ret;
        } catch (error: any) {
            if (error?.error) {
                const serverError = error.error;
                const ret: ServiceResponse = {
                    ok: false,
                    msg: 'Ha ocurrido un error inesperado',
                    resp: serverError,
                };
                return ret;
            }
            return connError;
        }
    }

    /**
     * Obtiene una lista de cuentas dado los filtros proveidos en un objeto.
     * @param filter filtros opcionales a la consulta.
     */
    async getAll(filter?: any): Promise<ServiceResponse> {
        try {
            if (filter) {
                filter = {...filter, ...this.getParams}
            } else {
                filter = {...this.getParams}
            }
            const url = this.url;
            const options: any = {
                headers: this.headers,
                params:{like: 'S', detalle: 'S', ejemplo: JSON.stringify({})}
            }
            if (JSON.stringify(filter) !== '{}') {
                options.params = {like: 'S', detalle: 'S', ejemplo: JSON.stringify(filter?filter:{})};
            }
            const resp : any= await this.http.get<any>(url, options).toPromise();
            const ret: ServiceResponse = {
                ok: true,
                msg:  "Lista consultada",
                resp: resp.lista,
            };
            return ret;
        } catch (error: any) {
            console.log(error);
            if (error?.error) {
                const serverError = error.error;
                const ret: ServiceResponse = {
                    ok: false,
                    msg: 'Ha ocurrido un error inesperado',
                    resp: serverError,
                };
                return ret;
            }
            return connError;
        }
    }
}
