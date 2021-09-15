import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor() { }
    
    getData(name: string): any {
        const objStr = localStorage.getItem(name);
        if (objStr) {
            return JSON.parse(objStr);
        }
        return {};
    }

    setData(name: string, data: any): void {
        const objStr = localStorage.setItem(name, JSON.stringify(data));
    }
}
