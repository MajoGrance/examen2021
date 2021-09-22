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
    ],
    imports: [
        CommonModule,
        SharedModule,
        PagesRoutingModule,
    ]
})
export class PagesModule { }
