import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'stringDate'
})
export class StringDatePipe implements PipeTransform {

    transform(value: string): Date {
        const anho = Number(value.slice(0, 4));
        const mes = Number(value.slice(4, 6));
        const dia = Number((value.slice(6, 8)));
        const date = new Date(anho, mes, dia);
        return date;
    }

}
