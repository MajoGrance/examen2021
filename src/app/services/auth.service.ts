import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ServiceResponse } from '../shared/interfaces';
import { connError } from '../shared/global';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    /**
     * Cabecera a enviarse a todos los servicios.
     */
    headers: any = {
    };

    constructor(
        private http: HttpClient,
        private storage: StorageService
    ) { }

    /**
     * Consulta al servidor por los usuarios del sistema, si no encuentra el usuario retorna un error
     * de credenciales no válidas, de ser otro tipo de error retorna un error de conexión o error
     * inesperado (por ejemplo 500), según corresponda.
     * @param body objeto que contiene el usuario y la contraseña de la persona que intenta loguearse.
     */
    async login( body: {usuario: string, contrasenha: string} ): Promise<ServiceResponse> {
        try {
            const resp: {lista: any[], totalDatos: number} = (await this.http.get(`${environment.host}/persona`,
                {params: {soloUsuariosDelSistema: true}}).toPromise()) as any;
            const ret = {
                ok: false,
                msg: 'Credenciales no válidas',
                resp: '',
            };
            if ( resp.lista.length ) {
                const userData = resp.lista.find((obj: any) => body.usuario === obj.usuarioLogin);
                if (userData) {
                    localStorage.setItem('user', JSON.stringify(userData));
                    return {
                        ok: true,
                        msg: 'Login exitoso',
                        resp: userData
                    };
                }
            }
            return ret;
        } catch (error: any){
            if (error.error) {
                return {
                    ok: false,
                    msg: 'Ha ocurrido un error inesperado',
                    resp: error.error,
                };
            } else {
                return {
                    ok: false,
                    msg: connError.msg,
                    resp: connError.resp,
                };
            }
        }
    }

    /**
     * Cierra una sesión activa.
     */
    async logout(): Promise<void> {
        localStorage.removeItem('user');
    }

    async cambiarContrasenha(usuario: string, resetear: boolean, nuevaContrasenha: string, viejaContrasenha?: string): Promise<ServiceResponse> {
        try {
            const body = {
                usuario,
                resetear,
                viejaContrasenha,
                nuevaContrasenha
            }
            if (resetear) {
                delete body.viejaContrasenha;
            }
            const url = `${environment.host}/auth/update-password`;
            const resp = await this.http.post<any>(`${url}`, body, {headers: this.headers}).toPromise();
            return resp;
        } catch(error: any) {
            console.log(error);
            if (error.error) {
                return {
                    ok: false,
                    msg: 'Ha ocurrido un error inesperado',
                    resp: error.error,
                };
            } else {
                return {
                    ok: false,
                    msg: connError.msg,
                    resp: connError.resp,
                };
            }
        }
    }
}
