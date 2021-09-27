import { Component, OnInit, Type, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';
import { UsuariosService } from '../../services/abm/usuario.service';
import { ClienteModel } from '../../models/cliente.model';
import { ClienteService } from '../../services/abm/cliente.service';
import { IReservaTurno, ReservaTurnoModel } from '../../models/reserva-turno.model';
import { TableColumn } from '../../shared/interfaces';
import { ReservaService } from '../../services/abm/reserva.service';
import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';
import { StringDatePipe } from '../../pipes/stringDate.pipe';
import { Router } from '@angular/router';
import { MensajesService } from '../../services/mensajes.service';
import { CopyService } from '../../services/copy.service';

@Component({
    selector: 'app-reservas',
    templateUrl: './reservas.component.html',
    styleUrls: ['./reservas.component.scss'],
    providers: [StringDatePipe]
})
export class ReservasComponent implements OnInit {
    filters: FormGroup = this.fb.group({
        fecha_desde: [new Date(), Validators.required],
        fecha_hasta: [new Date(), Validators.required],
        empleado: [''],
        cliente: ['']
    });
    empleadoModel: Type<any> = UsuarioModel;
    clienteModel: Type<any> = ClienteModel;
    source: IReservaTurno[] = [];
    innerWidth = window.innerWidth;
    displayEditar = false;
    reservaForm = new ReservaTurnoModel().getFormGroup();

    @HostListener('window:resize')
    onResize(): void {
        this.innerWidth = window.innerWidth;
    }

    constructor(
        private fb: FormBuilder,
        public empleadoService: UsuariosService,
        public clienteService: ClienteService,
        private reservaService: ReservaService,
        private loadingService: LoadingService,
        private toastService: ToastService,
        private stringDate: StringDatePipe,
        private mensajesService: MensajesService,
        private copyService: CopyService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.init();
    }
    
    async init(): Promise<void> {
        await this.getReservas();
    }

    async getReservas(): Promise<void> {
        this.loadingService.setLoading(true);
        const filters: any = {
            fechaDesdeCadena: this.stringDate.inverse(this.filters?.value?.fecha_desde).replace(/-/g, ''),
            fechaHastaCadena: this.stringDate.inverse(this.filters?.value?.fecha_hasta).replace(/-/g, '')
        };
        if (this.filters.value.cliente) {
            filters.idCliente = {"idPersona": this.filters.value.cliente};
        }
        if (this.filters.value.empleado) {
            filters.idEmpleado = {"idPersona": this.filters.value.empleado};
        }
        const resp = await this.reservaService.getAll(filters);
        if (resp.ok) {
            const source = (resp.resp as IReservaTurno[])
            for (const obj of source) {
                obj.profesional = `${obj.idEmpleado?.nombre} ${obj.idEmpleado?.apellido}`
                obj.cliente = `${obj.idCliente?.nombre} ${obj.idCliente?.apellido}`
            }
            this.source = source;
            this.loadingService.setLoading(false);
        } else {
            this.toastService.show('top-right', 'error', resp.msg, resp.resp);
        }
    }

    async limpiar(): Promise<void> {
        this.filters = this.fb.group({
            fecha_desde: [new Date(), Validators.required],
            fecha_hasta: [new Date(), Validators.required],
            empleado: [''],
            cliente: ['']
        });
        this.getReservas();
    }
    
    async navigate(url: string): Promise<void> {
        await this.router.navigate([url]);
    }

    async editarReserva(row: IReservaTurno): Promise<void> {
        this.loadingService.setLoading(true);
        const resp = await this.reservaService.get(row.idReserva);
        if (resp.ok) {
            const obj: IReservaTurno = resp.resp;
            this.reservaForm = this.fb.group({
                idReserva: obj?.idReserva,
                observacion: obj?.observacion,
                flagAsistio: obj?.flagAsistio,
            });
            this.displayEditar = true;
        } else {
            this.toastService.show('top-right', 'error', resp.msg, resp.resp);
        }
        this.loadingService.setLoading(false);
    }

    async cancelarReserva(row: IReservaTurno): Promise<void> {
        this.loadingService.setLoading(true);
        const resp = await this.reservaService.get(row.idReserva);
        if (resp.ok) {
            const resSiNo = await this.mensajesService.preguntarSiNo('Cancelar Reserva', 'Seguro/a que desea cancelar la reserva?');
            if ( resSiNo ) {
                const obj: IReservaTurno = resp.resp;
                this.reservaForm = this.fb.group({
                    idReserva: obj?.idReserva,
                    observacion: obj?.observacion,
                    flagAsistio: 'N',
                });
                const respPut = await this.reservaService.put(row.idReserva, this.reservaForm.getRawValue());
                if (respPut.ok) {
                    this.toastService.show('top-right', 'success', respPut.msg, respPut.resp?.idReserva);
                    this.getReservas();
                } else {
                    this.toastService.show('top-right', 'error', respPut.msg, respPut.resp);
                }
            }
        } else {
            this.toastService.show('top-right', 'error', resp.msg, resp.resp);
        }
        this.loadingService.setLoading(false);

    }

    async nuevaFicha(row: IReservaTurno): Promise<void> {
        this.loadingService.setLoading(true);
        const resp = await this.reservaService.get(row.idReserva);
        if (resp.ok) {
            const resSiNo = await this.mensajesService.preguntarSiNo('Nueva Ficha', 'Crear Ficha para la reserva?');
            if ( resSiNo ) {
                const obj: IReservaTurno = resp.resp;
                if ( obj.flagAsistio !== 'S' ) {
                    this.reservaForm = this.fb.group({
                        idReserva: obj?.idReserva,
                        observacion: obj?.observacion,
                        flagAsistio: 'S',
                    });
                    const respPut = await this.reservaService.put(row.idReserva, this.reservaForm.getRawValue());
                    if (respPut.ok) {
                        this.toastService.show('top-right', 'success', respPut.msg, respPut.resp?.idReserva);
                        this.copyService.object = obj;
                        this.copyService.url = 'sitio/fichas/agregar';
                        this.router.navigate(['sitio','fichas','agregar'])
                    } else {
                        this.toastService.show('top-right', 'error', respPut.msg, respPut.resp);
                    }
                } else {
                    this.copyService.object = obj;
                    this.copyService.url = 'sitio/fichas/agregar';
                    this.router.navigate(['sitio','fichas','agregar'])
                }
            }
        } else {
            this.toastService.show('top-right', 'error', resp.msg, resp.resp);
        }
        this.loadingService.setLoading(false);
    }
}
