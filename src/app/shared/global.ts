import { ServiceResponse } from './interfaces';

export const connError: ServiceResponse = {
    ok: false,
    msg: 'No se pudo conectar con el servidor',
    resp: 'Verifique su conexión a internet y vuelva a intentar'
}

export const ANCHO_MENU_ABIERTO = 18;
export const ANCHO_MENU_CERRADO = 3.5;
