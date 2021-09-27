import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';

@Injectable({
    providedIn: 'root'
})
export class ClienteService extends BaseService {
    url = `${environment.host}/persona`;
}
