import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ServiceResponse } from '../shared/interfaces';
import { connError } from '../shared/global';
import { SeguridadService } from './seguridad.service';

@Injectable({
    providedIn: 'root'
})
export class BaseService {
    /**
     * Url correspondiente al servicio a consultar.
     */
    url!: string;
    /**
     * Cuerpo de la consulta a ser realizada.
     */
    body: any = {};
    /**
     * Cabecera a enviarse a todos los servicios.
     */
    headers: any = {
    };
    /**
     * Mensaje a mostrarse cuando se crea un registro.
     */
    creadoMsg = 'Registro creado';
    /**
     * Mensaje a mostrarse cuando se elimina un registro.
     */
    eliminadoMsg = 'Registro eliminado';
    /**
     * Mensaje a mostrarse cuando se edita un registro.
     */
    editadoMsg = 'Registro editado';
    /**
     * Mensaje a mostrarse cuando se edita un registro.
     */
    deleteFields: string[] = [];
    /**
     * Parametros de la consulta get.
     */
    getParams: any = {};

    constructor(
        public http: HttpClient,
        public seguridadService: SeguridadService
    ) { }

    /**
     * Guarda en el servidor archivos ligados a la empresa.
     * @param file archivo a guardar en el servidor.
     * @param tipo identificador de tipo de archivo a guardarse.
     * @param id correspondiente a la empresa a la que se debe ligar el archivo.
     */
    uploadFile( file: File, tipo: 'empresa' | 'empleado' | 'cuenta',
                campo: 'logo' | 'firma_digital' | 'foto', id: number ): Promise<ServiceResponse> {
        return new Promise( (resolve) => {
            try {
                const formData = new FormData();
                const xhr = new XMLHttpRequest();
                formData.append('imagen', file, file.name);
                formData.append('nombre', campo);
                xhr.onreadystatechange = () => {
                    if ( xhr.readyState === 4 ) {
                        const resp = JSON.parse( xhr.response );
                        if ( xhr.status === 200 ) {
                            if (!resp.ok) {
                                resolve( {ok: false, msg: resp.msg, resp: resp.resp} );
                            } else {
                                resolve( {ok: true, msg: '', resp: xhr.response} );
                            }
                        } else {
                            resolve( {ok: false, msg: resp.msg, resp: resp.resp} );
                        }
                    }
                };
                const url = `${ environment.host }/file/${ tipo }/${ id }`;
                xhr.open('POST', url);
                xhr.send( formData );
            } catch (error) {
                resolve (connError);
            }
        });
    }

    /**
     * Obtiene del servidor un archivo.
     * @param file nombre del archivo por el que se consulta.
     * @param tipo identificador de tipo de archivo a guardarse.
     */
    getFile( file: string, tipo: 'empresa' | 'empleado' | 'cuenta'): Promise<Blob | null> {
        return new Promise( (resolve, reject) => {
            try {
                const formData = new FormData();
                const xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if ( xhr.readyState === 4 ) {
                        if ( xhr.status === 200 ) {
                            resolve( xhr.response );
                        } else {
                            reject( xhr.response );
                        }
                    }
                };
                const url = `${ environment.host }/file/${ tipo }/${ file }`;
                xhr.open('GET', url);
                xhr.responseType = 'blob';
                xhr.send( formData );
            } catch (error) {
                reject (null);
            }
        });
    }

    /**
     * Obtiene un objeto dado un id.
     * @param id correspondiente al objeto por el cual se consulta.
     * @param empresa_id correspondiente al objeto por el cual se consulta.
     */
    async get(id: number): Promise<ServiceResponse> {
        try {
            const url = `${this.url}/${id}`;
            const resp = await this.http.get<any>(url, {headers: this.headers}).toPromise();
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
                params:{like: 'S', ejemplo: JSON.stringify({})}
            }
            if (JSON.stringify(filter) !== '{}') {
                options.params = {like: 'S', ejemplo: JSON.stringify(filter?filter:{})};
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

    /**
     * Modifica un objeto de la base de datos.
     * @param id clave primaria del objeto a modificar.
     * @param body objeto que determina que campos deben modificarse y sus nuevos valores.
     */
    async put(id: number, body: any): Promise<ServiceResponse> {
        try {
            this.body = body;
            for (const field of this.deleteFields) {
                delete this.body[field];
            }
            const url = `${this.url}`;
            const resp = await this.http.put<any>(url, this.body, {headers: this.headers}).toPromise();
            const ret: ServiceResponse = {
                ok: true,
                msg: this.editadoMsg,
                resp: resp?resp:this.body,
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
     * Elimina un objeto de la base de datos.
     * @param id clave primaria del objeto a eliminar.
     */
    async delete(id: number): Promise<ServiceResponse> {
        try {
            const resp = await this.http.delete<any>(`${this.url}/${id}`, {headers: this.headers}).toPromise();
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
     * Modifica un objeto de la base de datos.
     * @param id clave primaria del objeto a modificar.
     * @param body objeto que determina que campos deben modificarse y sus nuevos valores.
     */
    async post(body: any): Promise<ServiceResponse> {
        try {
            this.body = body;
            for (const field of this.deleteFields) {
                delete this.body[field];
            }
            const resp = await this.http.post<any>(`${this.url}`, this.body, {headers: this.headers}).toPromise();
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
}
