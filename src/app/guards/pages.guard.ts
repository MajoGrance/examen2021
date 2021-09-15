import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SeguridadService } from '../services/seguridad.service';

@Injectable({
    providedIn: 'root'
})
export class PagesGuard implements CanActivate {
    constructor(
        private seguridadService: SeguridadService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const user = this.seguridadService.getCurrentUser();
        if (!user) {    
            this.router.navigate(['/auth/login']);
            return false;
        }
        return true;
    }
}
