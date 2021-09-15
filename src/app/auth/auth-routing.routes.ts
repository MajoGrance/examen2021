import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { LoginGuard } from '../guards/login.guard';

const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
            { path: 'logout', component: LogoutComponent },
            {
                path: '**',
                redirectTo: 'login',
                pathMatch: 'full',
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [LoginGuard]
})
export class AuthRoutingModule { }
