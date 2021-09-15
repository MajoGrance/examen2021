import { Component, OnInit, Input, Type, OnDestroy, Output, EventEmitter, HostListener } from '@angular/core';
import { MenuItems } from '../../../pages/pages-menu';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { FormGroup } from '@angular/forms';
import { LoadingService } from '../../../services/loading.service';
import { SeguridadService } from '../../../services/seguridad.service';
import { CopyService } from '../../../services/copy.service';
import { Subscription } from 'rxjs';
import { MensajesService } from '../../../services/mensajes.service';

@Component({
    selector: 'app-window',
    templateUrl: './window.component.html',
    styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnInit, OnDestroy {
    @Input() title!: string;
    @Input() editando!: boolean;
    @Input() nuevo!: boolean;
    @Input() url!: string;
    @Input() model!: Type<any>;
    @Input() service!: any;
    @Input() form!: FormGroup;
    @Input() name!: string;
    @Input() object!: any;
    @Input() modificado!: any;
    @Input() titleField = 'id';
    @Output() formChange = new EventEmitter();
    @Output() objectChange = new EventEmitter();
    @Output() editandoChange = new EventEmitter();
    @Output() nuevoChange = new EventEmitter();
    @Output() modificadoChange = new EventEmitter();
    id!: string;
    routerSub!: Subscription;
    formSub!: Subscription;
    options = [
        {
            icon: 'pi pi-pencil',
            command: () => {
                // this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
            }
        },
        {
            icon: 'pi pi-refresh',
            command: () => {
                // this.messageService.add({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
            }
        },
        {
            icon: 'pi pi-trash',
            command: () => {
                // this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
            }
        },
        {
            icon: 'pi pi-upload',
            routerLink: ['/fileupload']
        },
        {
            icon: 'pi pi-external-link',
            url: 'http://angular.io'

        }
    ];
    /**
     * Ancho de la pantalla del dispositivo en el que corre el sistema en px.
     */
    innerWidth = window.innerWidth;
    phoneItems = [
        {
            icon: 'pi pi-pencil',
            command: () => {
                this.setEditando(true);
            }
        },
        {
            icon: 'pi pi-trash',
            command: () => {
                this.delete();
            }
        },
        {
            icon: 'pi pi-copy',
            command: () => {
                this.copy();
            }
        },
    ];

    @HostListener('window:resize')
    onResize(): void {
        this.innerWidth = window.innerWidth;
    }

    get loading(): boolean {
        return this.loadingService.loading;
    }
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private toastService: ToastService,
        private loadingService: LoadingService,
        private seguridadService: SeguridadService,
        private copyService: CopyService,
        private mensajeService: MensajesService,
    ) { }

    ngOnInit(): void {
        setTimeout(() => {
            this.init();
        });
    }

    ngOnDestroy(): void {
        this.routerSub?.unsubscribe();
    }

    getIcon(): string {
        const modulos = new MenuItems();
        const url = this.router.url;
        for (const mod of modulos.MENU_ITEMS) {
            if (url.indexOf(mod.link) > -1) {
                return mod.icon;
            }
        }
        return '';
    }

    async cancelarEdicion(): Promise<void> {
        if (this.modificado) {
            const resp = await this.mensajeService.descartarCambios();
            if (!resp) {
                return;
            }
        }
        const modelo = new this.model().deserialize(this.object);
        this.setForm(modelo.getFormGroup());
        this.setEditando(false);
        this.setModificado(false);
        this.subscribeForm();
    }

    setForm(form: FormGroup): void {
        this.form = form;
        this.formChange.emit(this.form);
    }

    setObject(object: any): void {
        this.object = object;
        this.objectChange.emit(this.object);
    }

    setModificado(value: boolean): void {
        this.modificado = value;
        this.modificadoChange.emit(this.modificado);
    }

    setEditando(value: boolean): void {
        this.editando = value;
        if (this.editando && !this.nuevo) {
            const user = this.seguridadService.getCurrentUser();
            this.form.get('fecha_edicion')?.setValue(new Date());
            this.form.get('actualizado_por')?.setValue(user?.usuarioLogin);
            setTimeout(() => {
                this.setModificado(false);
            },20);
        }
        if (this.editando) {
            this.phoneItems = [
                {
                    icon: 'pi pi-save',
                    command: () => {
                        this.save()
                    }
                },
                {
                    icon: 'pi pi-times',
                    command: () => {
                        this.cancelarEdicion()
                    }
                },
                {
                    icon: 'pi pi-trash',
                    command: () => {
                        this.delete();
                    }
                },
                {
                    icon: 'pi pi-copy',
                    command: () => {
                        this.copy();
                    }
                },
            ];
        } else {
            this.phoneItems = [
                {
                    icon: 'pi pi-pencil',
                    command: () => {
                        this.setEditando(true);
                    }
                },
                {
                    icon: 'pi pi-trash',
                    command: () => {
                        this.delete();
                    }
                },
                {
                    icon: 'pi pi-copy',
                    command: () => {
                        this.copy();
                    }
                },
            ];
        }
        this.editandoChange.emit(this.editando);
    }

    setNuevo(value: boolean): void {
        this.nuevo = value;
        this.nuevoChange.emit(this.nuevo);
    }

    async goBack(): Promise<void> {
        await this.router.navigate([this.url])
    }

    async subscribeForm(): Promise<void> {
        this.formSub?.unsubscribe();
        this.form.valueChanges.subscribe({
            next: () => {
                setTimeout(() => {
                    this.setModificado(true);
                })
            }
        });
    }
    
    async init(): Promise<void> {
        this.routerSub?.unsubscribe();
        this.routerSub = this.route.params.subscribe({
            next: async params => {
                this.loadingService.setLoading(true);
                this.id = params.id;
                if (this.id !== 'nuevo') {
                    this.setNuevo(false);
                    const resp = await this.service.get(this.id);
                    this.title = `${this.name} - ${String(resp.resp[this.titleField])?.slice(0,10)}`
                    if (resp.ok) {
                        this.setObject(resp.resp);
                        this.setForm(new this.model().deserialize(resp.resp).getFormGroup());
                        this.subscribeForm();
                        setTimeout(() => {
                            this.setModificado(false);
                        },20);
                    } else {
                        this.toastService.show('top-right', 'error', resp.msg, resp.resp)
                    }
                } else {
                    const user = this.seguridadService.getCurrentUser();
                    let form = new this.model().getFormGroup();
                    this.setNuevo(true);
                    this.setEditando(true);
                    this.title = `${this.name} - NUEVO`;
                    if (this.copyService.object) {
                        if (this.router.url.indexOf(String(this.copyService.url)) > -1) {
                            const modelo = new this.model().copy(this.copyService.object);
                            form = modelo.getFormGroup();
                            this.copyService.object = null;
                            this.copyService.url = null;
                        }
                    }
                    form.get('creado_por')?.setValue(user?.usuarioLogin);
                    form.get('fecha_creacion')?.setValue(new Date());
                    this.setObject(form.getRawValue());
                    this.setForm(form);
                    this.subscribeForm();
                    setTimeout(() => {
                        this.setModificado(false);
                    },20);
                }
                this.loadingService.setLoading(false);
            }
        });
    }

    async save(): Promise<void> {
        this.form.markAllAsTouched();
        if (this.form.valid) {
            this.loadingService.setLoading(true);
            const modelo = new this.model().deserialize(this.form.getRawValue());
            if (this.object.activo && !modelo.activo) {
                const user = this.seguridadService.getCurrentUser();
                modelo.inactivado_por = user?.usuarioLogin;
                modelo.fecha_inactivacion = new Date();
            }
            const resp = await modelo.save(this.service);
            if (resp.ok) {
                this.toastService.show('top-right', 'success', resp.msg, resp.resp[this.titleField]);
                this.setModificado(false);
                await this.router.navigate([this.url]);
            } else {
                this.toastService.show('top-right', 'error', resp.msg, resp.resp);
            }
            this.loadingService.setLoading(false);
        }
    }

    async copy(): Promise<void> {
        this.copyService.object = this.form.getRawValue();
        this.copyService.url = this.url;
        await this.router.navigate([`${this.url}/nuevo`]);
    }

    async delete(): Promise<void> {
        const confirmacion = await this.mensajeService.eliminarRegistros([this]);
        if (!confirmacion) {
            return;
        }
        this.loadingService.setLoading(true);
        const modelo = new this.model().deserialize(this.form.getRawValue());
        const resp = await modelo.delete(this.service);
        if (resp.ok) {
            this.toastService.show('top-right', 'success', resp.msg, resp.resp);
            this.setModificado(false);
            await this.router.navigate([this.url]);
        } else {
            this.toastService.show('top-right', 'error', resp.msg, resp.resp);
        }
        this.loadingService.setLoading(false);
    }
}
