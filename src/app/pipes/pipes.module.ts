import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimePipe } from './time.pipe';
import { StringDatePipe } from './stringDate.pipe';



@NgModule({
    declarations: [
        TimePipe,
        StringDatePipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        TimePipe,
        StringDatePipe
    ]
})
export class PipesModule { }
