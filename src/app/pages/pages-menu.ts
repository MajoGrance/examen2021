import { SidebarMenu } from '../shared/interfaces';

export class MenuItems {
    MENU_ITEMS: SidebarMenu[] = [
        {
            icon: 'home',
            label: 'Inicio',
            link: '/sitio/dashboard',
        },
        {
            icon: 'category',
            label: 'Categorías',
            link: '/sitio/categorias',
        },
        {
            icon: 'label',
            label: 'Sub categorías',
            link: '/sitio/sub-categorias',
        },
        {
            icon: 'inventory',
            label: 'Presentación de Productos',
            link: '/sitio/presentacion-productos',
        },
        {
            icon: 'group',
            label: 'Pacientes',
            link: '/sitio/pacientes',
        },
        {
            icon: 'date_range',
            label: 'Horarios Agendado',
            link: '/sitio/horario-agenda',
        },
        {
            icon: 'event',
            label: 'Horarios excepcionales',
            link: '/sitio/horarios-excepcion',
        },
        {
            icon: 'event_available',
            label: 'Reservar turno',
            link: '/sitio/reservar-turno',
        },
        {
            icon: 'folder_shared',
            label: 'Fichas clínicas',
            link: '/sitio/reservar-turno',
        },
        {
            icon: 'manage_accounts',
            label: 'Servicios',
            link: '/sitio/servicios',
        },
        {
            icon: 'list_alt',
            label: 'Reportes',
            link: '/sitio/reportes',
            children: [
                {
                    icon: 'security',
                    label: 'Servicios resumido',
                    link: '/sitio/reportes/servicios-resumido',
                },
                {
                    icon: 'security',
                    label: 'Servicios detallado',
                    link: '/sitio/reportes/servicios-detallado',
                },
            ]
        },
    ]

    constructor() {
    }
}
