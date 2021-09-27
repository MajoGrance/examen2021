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
            label: 'Tipos de Servicios',
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
            link: '/sitio/horario-excepcion',
        },
        {
            icon: 'event_available',
            label: 'Reservas',
            link: '/sitio/reservas',
            expanded: true,
            children: [
                {
                    icon: 'list',
                    label: 'Lista de reservas',
                    link: '/sitio/reservas/lista',
                },
                {
                    icon: 'add_task',
                    label: 'Agregar reservas',
                    link: '/sitio/reservas/agregar',
                },
            ]
        },
        {
            icon: 'folder_shared',
            label: 'Fichas clínicas',
            link: '/sitio/fichas',
            expanded: true,
            children: [
                {
                    icon: 'list',
                    label: 'Lista de Fichas',
                    link: '/sitio/fichas/lista',
                },
                {
                    icon: 'playlist_add',
                    label: 'Agregar Ficha',
                    link: '/sitio/fichas/agregar',
                },
            ]
        },
        {
            icon: 'manage_accounts',
            label: 'Servicios',
            link: '/sitio/servicios',
            expanded: true,
            children: [
                {
                    icon: 'list',
                    label: 'Lista de Servicios',
                    link: '/sitio/servicios/lista',
                },
                {
                    icon: 'playlist_add',
                    label: 'Agregar Servicio',
                    link: '/sitio/servicios/agregar',
                },
            ],
        },
        {
            icon: 'list_alt',
            label: 'Reportes',
            link: '/sitio/reportes',
            expanded: true,
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
