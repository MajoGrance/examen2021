import { Injectable } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Injectable({
    providedIn: 'any'
})
export class LoadingService {
    loading = false;

    constructor(
        private router: Router
    ) {
        this.subscribeRouter();
    }

    async setLoading(value: boolean): Promise<void> {
        this.loading = value;
    }

    /**
     * Subscripción para identificar el momento en que se redirecciona.
     */
    subscribeRouter(): void {
        this.router.events.subscribe({
            next: event => {
                if (event instanceof NavigationStart) {
                    this.loading = true;
                }
                if (event instanceof NavigationEnd) {
                    this.loading = false;
                }
                if (event instanceof NavigationCancel) {
                    this.loading = false;
                }
                if (event instanceof NavigationError) {
                    this.loading = false;
                }
            }
        });
    }
}
