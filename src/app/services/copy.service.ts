import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CopyService {
    object: any = null;
    url: string | null = null;

    constructor() { 
        setInterval(() => {
            this.object = null;
            this.url = null
        }, 3000)
    }
}
