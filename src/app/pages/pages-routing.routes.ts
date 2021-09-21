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
