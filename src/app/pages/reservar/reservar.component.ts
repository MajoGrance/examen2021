import { Component, OnInit, Type } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { IUsuario, UsuarioModel } from 'src/app/models/usuario.model';
import { UsuariosService } from 'src/app/services/abm/usuario.service';
import { ClienteModel, ICliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/abm/cliente.service';
import { ReservaTurnoModel, IReservaTurno } from '../../models/reserva-turno.model';
import { AgendaService } from '../../services/agenda.service';
import { StringDatePipe } from '../../pipes/stringDate.pipe';
import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';
import { TimePipe } from '../../pipes/time.pipe';
import { ReservaService } from '../../services/abm/reserva.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-reservar',
    templateUrl: './reservar.component.html',
    styleUrls: ['./reservar.component.scss'],
    providers: [StringDatePipe, TimePipe]
})
export class ReservarComponent implements OnInit {
    reserva: FormGroup = new ReservaTurnoModel().getFormGroup();
    empleadoModel: Type<any> = UsuarioModel;
    clienteModel: Type<any> = ClienteModel;
    source: any[] = [];
    innerWidth = window.innerWidth;
    mostrarAgenda = new FormControl();
    seleccionado = new FormControl();

    constructor(
        public empleadoService: UsuariosService,
        public clienteService: ClienteService,
        private agendaService: AgendaService,
        private stringDate: StringDatePipe,
        private loadingService: LoadingService,
        private toastService: ToastService,
        private time: TimePipe,
        private reservaService: ReservaService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.getAgenda();
    }

    async save(): Promise<void> {
        this.reserva.markAllAsTouched();
        if (this.reserva.valid && this.seleccionado?.value) {
            const obj = this.getFechaHora(this.reserva.getRawValue());
            const resp = await this.reservaService.post(obj);
            if (resp.ok) {
                this.reserva = new ReservaTurnoModel().getFormGroup();
                this.seleccionado = new FormControl();
                this.getAgenda();
                this.toastService.show('top-right', 'success', resp.msg, resp.resp?.idReserva);
                this.router.navigate(['sitio', 'reservas', 'lista'])
            } else {
                this.toastService.show('top-right', 'error', resp.msg, resp.resp);
            }
        }
    }

    getFechaHora(obj: any): IReservaTurno {
        obj.fechaCadena = this.stringDate.inverse(obj.fechaCadena).replace(/-/g, '');
        obj.horaInicioCadena = this.time.transform(this.seleccionado.value.horaInicioCadena).replace(/:/g, '');
        obj.horaFinCadena = this.time.transform(this.seleccionado.value.horaFinCadena).replace(/:/g, '');
        obj.idCliente = {idPersona: obj.idCliente?.idPersona}
        obj.idEmpleado = {idPersona: obj.idEmpleado?.idPersona}
        return obj;
    }

    async getAgenda(): Promise<void> {
        this.loadingService.setLoading(true);
        const resp = await this.agendaService.get(this.reserva.value.empleado, this.stringDate.
            inverse(this.reserva.value.fechaCadena).replace(/-/g, ''), this.mostrarAgenda?.value?'':'S');
        if (resp.ok) {
            const source = resp.resp;
            for (const obj of source) {
                obj.cliente = `${obj.idCliente?.nombre?obj.idCliente?.nombre:''} ${obj.idCliente?.apellido?obj.idCliente?.apellido:''}`
            }
            this.source = source;
            this.seleccionado.setValue(null);
        } else {
            this.toastService.show('top-right', 'error', resp.msg, resp.resp);
        }
        this.loadingService.setLoading(false);
    }

    async pasteCliente(obj: ICliente): Promise<void> {
        this.reserva.get('idCliente')?.setValue(obj);
        this.reserva.get('cliente_nombre')?.setValue(`${obj?.nombre?obj.nombre:''} ${obj?.apellido?obj?.apellido:''}`);
    }

    async pasteEmpleado(obj: IUsuario): Promise<void> {
        this.reserva.get('idEmpleado')?.setValue(obj);
        this.reserva.get('empleado_nombre')?.setValue(`${obj?.nombre?obj.nombre:''} ${obj?.apellido?obj?.apellido:''}`);
        this.getAgenda();
    }
}
