import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UsuariosService } from 'src/app/services/abm/usuario.service';
import { ReservaTurnoModel } from '../../../models/reserva-turno.model';
import { StringDatePipe } from '../../../pipes/stringDate.pipe';
import { LoadingService } from '../../../services/loading.service';
import { ToastService } from '../../../services/toast.service';
import { TimePipe } from '../../../pipes/time.pipe';
import { ReservaService } from '../../../services/abm/reserva.service';

@Component({
    selector: 'app-editar-observacion',
    templateUrl: './editar-observacion.component.html',
    styleUrls: ['./editar-observacion.component.scss'],
    providers: [StringDatePipe, TimePipe]
})
export class EditarComponent implements OnInit {
    @Input() reserva: FormGroup = new ReservaTurnoModel().getFormGroup();
    @Input() display = false;
    @Output() displayChange = new EventEmitter();
    @Output() confirmChanges = new EventEmitter();

    constructor(
        public empleadoService: UsuariosService,
        private loadingService: LoadingService,
        private toastService: ToastService,
        private reservaService: ReservaService,
    ) { }

    ngOnInit(): void {
    }

    async save(): Promise<void> {
        this.reserva.markAllAsTouched();
        if (this.reserva.valid) {
            this.loadingService.setLoading(true);
            const obj = this.reserva.getRawValue();
            const resp = await this.reservaService.put(obj.id, obj);
            this.loadingService.setLoading(false);
            if (resp.ok) {
                this.setDisplay(false);
                this.toastService.show('top-right', 'success', resp.msg, resp.resp?.idReserva);
            } else {
                this.toastService.show('top-right', 'error', resp.msg, resp.resp);
            }
        }
    }

    setDisplay(value: boolean): void {
        this.display = value;
        this.displayChange.emit(this.display);
    }
}
