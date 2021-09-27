import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.routes';
import { HomeComponent } from './home/home.component';
import { CategoriaListaComponent } from './categoria/categoria-lista/categoria-lista.component';
import { CategoriaVentanaComponent } from './categoria/categoria-ventana/categoria-ventana.component';
import { TipoProductoListaComponent } from './tipo-producto/tipo-producto-lista/tipo-producto-lista.component';
import { TipoProductoVentanaComponent } from './tipo-producto/tipo-producto-ventana/tipo-producto-ventana.component';
import { PresentacionProductoListaComponent } from './presentacion-producto/presentacion-producto-lista/presentacion-producto-lista.component';
import { PresentacionProductoVentanaComponent } from './presentacion-producto/presentacion-producto-ventana/presentacion-producto-ventana.component';
import { PacientesListaComponent } from './clientes/pacientes-lista/pacientes-lista.component';
import { PacientesVentanaComponent } from './clientes/pacientes-ventana/pacientes-ventana.component';
import { HorarioAgendaVentanaComponent } from './horario-agenda/horario-agenda-ventana/horario-agenda-ventana.component';
import { HorarioAgendaListaComponent } from './horario-agenda/horario-agenda-lista/horario-agenda-lista.component';
import { HorariosExcepcionListaComponent } from './horarios-excepcion/horarios-excepcion-lista/horarios-excepcion-lista.component';
import { HorariosExcepcionVentanaComponent } from './horarios-excepcion/horarios-excepcion-ventana/horarios-excepcion-ventana.component';
import { ReservasComponent } from './reservas/reservas.component';
import { ReservarComponent } from './reservar/reservar.component';
import { EditarComponent } from './reservas/editar-observacion/editar-observacion.component';
import { FichasClinicasListaComponent } from './fichas-clinicas-lista/fichas-clinicas-lista.component';
import { FichasClinicasAgregarComponent } from './fichas-clinicas-agregar/fichas-clinicas-agregar.component';
import { ServiciosListaComponent } from './servicios-lista/servicios-lista.component';
import { ServiciosAgregarComponent } from './servicios-agregar/servicios-agregar.component';
import { FichasClinicasEditarComponent } from './fichas-clinicas-editar/fichas-clinicas-editar.component';
import { ServicioEditarComponent } from './servicio-editar/servicio-editar.component';
import { ServiciosResumidoComponent } from './servicios-resumido/servicios-resumido.component';
import { ServiciosDetalladoComponent } from './servicios-detallado/servicios-detallado.component';

@NgModule({
    declarations: [
        PagesComponent,
        HomeComponent,
        CategoriaListaComponent,
        CategoriaVentanaComponent,
        TipoProductoListaComponent,
        TipoProductoVentanaComponent,
        PresentacionProductoListaComponent,
        PresentacionProductoVentanaComponent,
        PacientesListaComponent,
        PacientesVentanaComponent,
        HorarioAgendaVentanaComponent,
        HorarioAgendaListaComponent,
        HorariosExcepcionListaComponent,
        HorariosExcepcionVentanaComponent,
        ReservasComponent,
        ReservarComponent,
        EditarComponent,
        FichasClinicasListaComponent,
        FichasClinicasAgregarComponent,
        ServiciosListaComponent,
        ServiciosAgregarComponent,
        FichasClinicasEditarComponent,
        ServicioEditarComponent,
        ServiciosResumidoComponent,
        ServiciosDetalladoComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        PagesRoutingModule,
    ]
})
export class PagesModule { }
