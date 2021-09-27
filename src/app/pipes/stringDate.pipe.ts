import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'stringDate'
})
export class StringDatePipe implements PipeTransform {

    transform(value: string): Date {
        const anho = Number(value.slice(0, 4));
        const mes = Number(value.slice(4, 6)) -1;
        const dia = Number((value.slice(6, 8)));
        const date = new Date(anho, mes, dia);
        return date;
    }

    inverse(value: Date): string {
        if (String(value).length === 10) {
            return String(value);
        }
        const year = value.getFullYear();
        const month = String(value.getMonth()+1).length < 2?`0${value.getMonth()+1}`:value.getMonth();
        const date = String(value.getDate()).length < 2?`0${value.getDate()}`:value.getDate();
        const ret = `${year}-${month}-${date}`;
        return ret;
    }

}
