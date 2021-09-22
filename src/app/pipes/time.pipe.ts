import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'time'
})
export class TimePipe implements PipeTransform {

    transform(value: string): string {
        const hora = value.slice(0, 2);
        const minuto = value.slice(2, 4);
        const time = `${hora}:${minuto}`
        return time;
    }

}
