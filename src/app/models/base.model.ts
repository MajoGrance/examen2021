import { ServiceResponse, TableColumn } from '../shared/interfaces';

export class RecordModel {

    constructor() { }

    serialize(): any {
        const obj: any = {};
        const currentObject: any = this;
        for (const key of this.keys()) {
            obj[key] = currentObject[key];
        }
        return obj;
    }

    getId(): number {
        return 0;
    }

    setId(id: number): void { }

    keys(): string[] {
        const keysList: string[] =  Object.keys(this);
        return keysList;
    }

    deserialize(input: object): this {
        Object.assign(this, input);
        return this;
    }

    async save(service: any): Promise<ServiceResponse> {
        if (service && service.post && service.put) {
            let method;
            if (!this.getId()) {
                const obj = await this.serialize();
                method = service.post(obj);
            } else {
                method = service.put(this.getId(), this.serialize());
            }
            const resp = await method;
            if (resp.ok) {
                this.setId(resp.resp.id);
            }
            return resp;
        } else {
            return {
                ok: false,
                msg: 'No se ha proveido servicio correctamente',
                resp: 'Provea el servicio para guardar y verifique que este implemente los métodos post y put'
            };
        }
    }

    async delete(service: any): Promise<ServiceResponse> {
        if (service && service.delete) {
            const resp = await service.delete(this.getId());
            return resp;
        } else {
            return {
                ok: false,
                msg: 'No se ha proveido servicio correctamente',
                resp: 'Provea el servicio para eliminar y verifique que este implemente el método delete'
            };
        }
    }

    getPasteColumns(): TableColumn[] {
        return [];
    }
}