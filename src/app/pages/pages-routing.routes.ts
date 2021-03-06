import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { PagesGuard } from '../guards/pages.guard';
import { CategoriaListaComponent } from './categoria/categoria-lista/categoria-lista.component';
import { CategoriaVentanaComponent } from './categoria/categoria-ventana/categoria-ventana.component';
import { WindowGuard } from '../guards/window.guard';
import { TipoProductoListaComponent } from './tipo-producto/tipo-producto-lista/tipo-producto-lista.component';
import { TipoProductoVentanaComponent } from './tipo-producto/tipo-producto-ventana/tipo-producto-ventana.component';
import { PresentacionProductoListaComponent } from './presentacion-producto/presentacion-producto-lista/presentacion-producto-lista.component';
import { PresentacionProductoVentanaComponent } from './presentacion-producto/presentacion-producto-ventana/presentacion-producto-ventana.component';
import { PacientesListaComponent } from './clientes/pacientes-lista/pacientes-lista.component';
import { PacientesVentanaComponent } from './clientes/pacientes-ventana/pacientes-ventana.component';
import { HorarioAgendaListaComponent } from './horario-agenda/horario-agenda-lista/horario-agenda-lista.component';
import { HorarioAgendaVentanaComponent } from './horario-agenda/horario-agenda-ventana/horario-agenda-ventana.component';
import { HorariosExcepcionListaComponent } from './horarios-excepcion/horarios-excepcion-lista/horarios-excepcion-lista.component';
import { HorariosExcepcionVentanaComponent } from './horarios-excepcion/horarios-excepcion-ventana/horarios-excepcion-ventana.component';
import { ReservasComponent } from './reservas/reservas.component';
import { ReservarComponent } from './reservar/reservar.component';
import { FichasClinicasListaComponent } from './fichas-clinicas-lista/fichas-clinicas-lista.component';
import { FichasClinicasAgregarComponent } from './fichas-clinicas-agregar/fichas-clinicas-agregar.component';
import { ServiciosListaComponent } from './servicios-lista/servicios-lista.component';
import { ServiciosAgregarComponent } from './servicios-agregar/servicios-agregar.component';
import { FichasClinicasEditarComponent } from './fichas-clinicas-editar/fichas-clinicas-editar.component';
import { ServicioEditarComponent } from './servicio-editar/servicio-editar.component';
import { ServiciosResumidoComponent } from './servicios-resumido/servicios-resumido.component';
import { ServiciosDetalladoComponent } from './servicios-detallado/servicios-detallado.component';

const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [PagesGuard],
        children: [
            { path: 'dashboard', component: HomeComponent },
            { path: 'categorias', component: CategoriaListaComponent },
            { path: 'categorias/:id', component: CategoriaVentanaComponent, canDeactivate: [WindowGuard]},
            { path: 'sub-categorias', component: TipoProductoListaComponent },
            { path: 'sub-categorias/:id', component: TipoProductoVentanaComponent, canDeactivate: [WindowGuard]},
            { path: 'presentacion-productos', component: PresentacionProductoListaComponent },
            { path: 'presentacion-productos/:id', component: PresentacionProductoVentanaComponent, canDeactivate: [WindowGuard]},
            { path: 'pacientes', component: PacientesListaComponent },
            { path: 'pacientes/:id', component: PacientesVentanaComponent, canDeactivate: [WindowGuard]},
            { path: 'horario-agenda', component: HorarioAgendaListaComponent },
            { path: 'horario-agenda/:id', component: HorarioAgendaVentanaComponent, canDeactivate: [WindowGuard]},
            { path: 'horario-excepcion', component: HorariosExcepcionListaComponent },
            { path: 'horario-excepcion/:id', component: HorariosExcepcionVentanaComponent, canDeactivate: [WindowGuard]},
            { path: 'reservas/lista', component: ReservasComponent },
            { path: 'reservas/agregar', component: ReservarComponent },
            { path: 'fichas/lista', component: FichasClinicasListaComponent },
            { path: 'fichas/agregar', component: FichasClinicasAgregarComponent },
            { path: 'fichas/:id', component: FichasClinicasEditarComponent },
            { path: 'servicios/lista', component: ServiciosListaComponent },
            { path: 'servicios/agregar', component: ServiciosAgregarComponent },
            { path: 'servicios/:id', component: ServicioEditarComponent },
            { path: 'reportes/servicios-resumido', component: ServiciosResumidoComponent },
            { path: 'reportes/servicios-detallado', component: ServiciosDetalladoComponent },
            {
                path: '**',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [PagesGuard]
})
export class PagesRoutingModule { }
