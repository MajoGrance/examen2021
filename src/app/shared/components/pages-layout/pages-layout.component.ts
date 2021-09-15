import { Component, Input, OnInit, HostListener } from '@angular/core';
import { SidebarMenu } from '../../interfaces';
import { SidebarService } from '../../../services/sidebar.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { LoadingService } from '../../../services/loading.service';
import { ANCHO_MENU_CERRADO } from '../../global';
import { SeguridadService } from '../../../services/seguridad.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-pages-layout',
    templateUrl: './pages-layout.component.html',
    styleUrls: ['./pages-layout.component.scss']
})
export class PagesLayoutComponent implements OnInit {
    /**
     * Menú completo a mostrarse en el sidebar.
     */
    @Input() menuItems: SidebarMenu[] = [];
    /**
     * Opciones del menu de usuario.
     */
    userMenu: MenuItem[] = [
        {
            icon: 'pi pi-sign-out',
            label: 'Cerrar sesión',
            routerLink: '/auth/logout'
        }
    ]
    /**
     * Ancho de la pantalla en pixeles.
     */
    innerWidth = window.innerWidth;
    /**
     * Formulario para cambiar la contrasenha.
     */
    contrasenhaForm = this.fb.group({
        viejaContrasenha: [null, Validators.required],
        nuevaContrasenha: [null, Validators.required],
    });
    /**
     * Indicador de visibilidad del modal para modificar contrasenha.
     */
    displayContrasenha = false;

    /**
     * Obtiene las iniciales del nombre del usuario actual.
     * @returns iniciales del usuario.
     */
     get iniciales(): string {
        const user = this.seguridadService.getCurrentUser();
        const primerNombre = user?.nombre?.split(' ')[0];
        const segundoNombre = user?.nombre?.split(' ')[1];
        const primeraInicial = primerNombre?primerNombre[0]:'';
        const segundaInicial = segundoNombre?segundoNombre[0]:'';
        const iniciales = `${primeraInicial.toUpperCase()}${segundaInicial.toUpperCase()}`;
        return iniciales;
    }

    /**
     * Obtiene el codigo del usuario actual
     * @returns codigo del usuario actual.
     */
    get nombreUsuario(): string {
        const user = this.seguridadService.getCurrentUser();
        const nombre = user?.nombre;
        return nombre?nombre:'';
    }

    /**
     * Consulta al servicio del sidebar si este se encuentra cerrado o abierto.
     * @returns true si el sidebar esta abierto, false en caso contrario.
     */
    get showMenu(): boolean {
        return this.sidebarService.showMenu;
    }

    /**
     * Consulta al servicio de carga si este se encuentra cargando.
     * @returns true si se está cargando, false en caso contrario.
     */
    get loading(): boolean {
        return this.loadingService.loading;
    }

    /**
     * Retorna el valor del ancho del menú sidebar cerrado.
     * @returns el ancho en rem del menú sidebar cerrado.
     */
    get closedSidebarWidth(): number {
        return ANCHO_MENU_CERRADO;
    }

    /**
     * Consulta al servicio del sidebar el ancho actual en rem, si nos encontramos en
     * un dispositivo pequeño y el menu esta cerrado, devuelve 0.
     * @returns el ancho del sidebar en rem.
     */
    get sidebarWidth(): number {
        if (this.innerWidth > 641) {
            return this.sidebarService.sidebarWidth;
        } else {
            if (!this.showMenu) {
                return 0;
            } else {
                return this.sidebarService.sidebarWidth;
            }
        }
        
    }

    /**
     * Escucha el evento de reajuste del tamaño de la pantalla del dispositivo
     * y actualiza el ancho de la pantalla. 
     */
    @HostListener('window:resize')
    onResize() {
        this.innerWidth = window.innerWidth;
    }
  
    constructor(
        private sidebarService: SidebarService,
        private loadingService: LoadingService,
        private router: Router,
        private fb: FormBuilder,
        private seguridadService: SeguridadService,
        private authService: AuthService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        if (this.innerWidth > 641) {
            this.sidebarService.openMenu();
        }
    }

    /**
     * Redirecciona a la página de inicio del sistema.
     */
    async goHome(): Promise<void> {
        await this.router.navigate(['/sitio/dashboard'])
    }

    /**
     * Si el sidebar se encuentra abierto, lo abre y viceversa.
     */
    toggleSidebar(): void {
        this.sidebarService.toogleMenu();
    }

    /**
     * Determina si una ruta dada es la que se encuentra seleccionada ahora.
     * @returns true si la ruta actual coincide con la ruta dada, en caso contrario
     * retorna false.
     */
    isActive(url: string): boolean {
        const urlActual = this.router.url;
        const idx = urlActual.indexOf(url);
        let valor = false;
        if (idx > -1) {
            valor = true;
        }
        return valor;
    }

    /**
     * Navega hasta una url dada.
     */
    async navigate(url: string): Promise<void> {
        await this.router.navigate([url]);
    }

    /**
     * Evento lanzado al dar click en un item del menu sidebar, si se tienen submenus, el submenu
     * se expande si esta cerrado y viceversa, por el contrario si no se tienen submenus, se
     * redirecciona al link del menu item.
     */
    async toggleMenuItem(item: SidebarMenu): Promise<void> {
        if (item.children && item.children.length) {
            this.sidebarService.openMenu();
            item.expanded = !item.expanded;
        } else {
            this.sidebarService.openMenu();
            this.closeMenu();
            await this.navigate(item.link);
        }
    }

    /**
     * Cierra el menú sidebar si el se abre la aplicacion en un dispositivo pequenho.
     */
    closeMenu(): void {
        if (!(this.innerWidth > 641)) {
            this.sidebarService.closeMenu();
        }
    }

    /**
     * Abre el formulario para modificar contrasenha.
     */
    async cambiarContrasenha(): Promise<void> {
        this.contrasenhaForm = this.fb.group({
            viejaContrasenha: [null, Validators.required],
            nuevaContrasenha: [null, Validators.required],
        });
        this.displayContrasenha = true;
    }

    /**
     * Confirma el cambio de contrasenha.
     */
    async confirmarCambiarContrasenha(): Promise<void> {
        this.contrasenhaForm.markAllAsTouched();
        if (this.contrasenhaForm.valid) {
            const value = this.contrasenhaForm.value;
            const user = this.seguridadService.getCurrentUser();
            if (user) {
                this.loadingService.setLoading(true);
                const resp = await this.authService.cambiarContrasenha(user.usuarioLogin, false, value.nuevaContrasenha, value.viejaContrasenha);
                if (resp.ok) {
                    this.toastService.show('top-right', 'success', 'Contraseña modificada', '');
                    this.displayContrasenha = false;
                } else {
                    this.toastService.show('top-right', 'error', resp.msg, resp.resp);
                }
                this.loadingService.setLoading(false);
            }
        }
    }
}
