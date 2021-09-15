import { Injectable } from '@angular/core';
import { CanDeactivate, UrlTree, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { CanDeactivateComponent } from '../shared/interfaces';

@Injectable({
    providedIn: 'root'
})
export class WindowGuard implements CanDeactivate<unknown> {
    canDeactivate(component: CanDeactivateComponent,
                  currentRoute: ActivatedRouteSnapshot,
                  currentState: RouterStateSnapshot,
                  nextState?: RouterStateSnapshot): Promise<boolean | UrlTree> | boolean {
        return component.canDeactivate ? component.canDeactivate(currentRoute, currentState, nextState) : true;
    }
}
