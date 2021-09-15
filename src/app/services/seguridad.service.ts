import { Injectable } from '@angular/core';
import { IUsuario } from '../models/usuario.model';

@Injectable({
    providedIn: 'root'
})
export class SeguridadService {

    constructor() { }

    /**
     * Obtiene el usuario actual.
     * @returns objeto con los datos del usuario actual si es que un usuario ya se ha logueado, en
     * caso contrario retorna null.
     */
    getCurrentUser(): IUsuario | null{
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            return user;
        }
        return null;
    }

    /**
     * Obtiene el token del usuario loggeado.
     * @returns el token del usuario actual.
     */
    getToken(): string | null {
        const token = localStorage.getItem('token');
        if (token) {
            return token;
        }
        return null;
    }
}
