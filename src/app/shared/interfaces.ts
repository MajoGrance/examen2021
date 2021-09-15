import { Type } from '@angular/core';
import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export interface ListaInterface {
    title: string;
    columns: TableColumn[];
    url: string;
    service: any;
    idField: string;
    model: Type<any>;
}

export interface VentanaInterface {
    name: string;
    title: string;
    titleField: string;
    url: string;
    editando: boolean;
    nuevo: boolean;
    modificado: boolean;
    model: Type<any>;
    object: any;
    formGroup: FormGroup;
    service: any;
}

export interface TableColumn {
    header: string;
    field: string;
    refField?: string;
    refName?: string;
    type: 'text' | 'numeric' | 'date' | 'boolean' | 'list' | 'hidden' | 'option' | 'id';
    filterType: 'text' | 'numeric' | 'date' | 'boolean' | 'option';
    hidden?: boolean;
    labels?: string[];
}

export interface ServiceResponse {
    ok: boolean;
    msg: string;
    resp: any;
}

export interface SidebarMenu {
    icon: string;
    label: string;
    link: string;
    expanded?: boolean;
    children?: SidebarMenu[];
}

export interface SidebarMenuFilter {
    icon: string;
    label: string;
    link: string;
    items?: SidebarMenu[];
}

export interface WindowData {
    header: string;
    bodyComponent: Type<any>;
    footerComponent: Type<any>;
    bodyContext?: any;
    footerContext?: string;
}

export interface ReferenceInputInterface {
    name: string,
    singleName: string,
    recordName: string,
    model: Type<any>,
    filters?: any,
    href?: string,
    component?: Type<any>
}

export type ValidatorFn = (c: AbstractControl) => ValidationErrors | null;

export interface Serializable {
    serialize(): object;
}

export interface Deserializable {
    deserialize(input: object): this;
}

export interface CanDeactivateChangePassComponent {
    canDeactivate: () => Promise<boolean> | boolean;
}

export interface CanDeactivateComponent {
    canDeactivate: (currentRoute: ActivatedRouteSnapshot,
                    currentState: RouterStateSnapshot,
                    nextState?: RouterStateSnapshot) => Promise<boolean> | boolean;
}
