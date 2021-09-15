import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext'
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PagesLayoutComponent } from './components/pages-layout/pages-layout.component';
import { MatIconModule } from '@angular/material/icon';
import { TableModule } from 'primeng/table'
import { ToastModule } from 'primeng/toast'
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MultiSelectModule } from 'primeng/multiselect';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { MessagesModule } from 'primeng/messages';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MessageService, ConfirmationService } from 'primeng/api';
import { WindowComponent } from './components/window/window.component';
import { CRUDComponent } from './components/crud/crud.component';
import { TextInputComponent } from './components/inputs/text-input/text-input.component';
import { BooleanInputComponent } from './components/inputs/boolean-input/boolean-input.component';
import { DateInputComponent } from './components/inputs/date-input/date-input.component';
import { MultipleReferenceInputComponent } from './components/inputs/multiple-reference-input/multiple-reference-input.component';
import { NumberInputComponent } from './components/inputs/number-input/number-input.component';
import { SelectInputComponent } from './components/inputs/select-input/select-input.component';
import { KeyInputComponent } from './components/inputs/key-input/key-input.component';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SpeedDialModule } from 'primeng/speeddial';
import { FieldsetModule } from 'primeng/fieldset';
import { InputMaskModule } from 'primeng/inputmask';
import { ChartModule } from 'primeng/chart'; 
import { SidebarSearchInputComponent } from './components/inputs/sidebar-search-input/sidebar-search-input.component';
import { TextAreaInputComponent } from './components/inputs/text-area-input/text-area-input.component';
import { TimeInputComponent } from './components/inputs/time-input/time-input.component';
import { DetailTableComponent } from './components/detail-table/detail-table.component';
import { DateMaskDirective } from './directives/date-mask.directive';
import { MultiSelectInputComponent } from './components/inputs/multi-select-input/multi-select-input.component';
import { ReferenceInputComponent } from './components/inputs/reference-input/reference-input.component';
import { DoughnutComponent } from './components/doughnut/doughnut.component';
import { CambiarContrasenha } from './components/pages-layout/cambiar-contrasenha/cambiar-contrasenha.component';

const PRIMENG = [
    DividerModule,
    InputTextModule,
    TableModule,
    AutoCompleteModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    CardModule,
    ProgressBarModule,
    AvatarModule,
    MultiSelectModule,
    MenuModule,
    TagModule,
    MessageModule,
    MessagesModule,
    ButtonModule,
    SplitButtonModule,
    CascadeSelectModule,
    CheckboxModule,
    CalendarModule,
    InputNumberModule,
    InputTextareaModule,
    TabViewModule,
    SpeedDialModule,
    FieldsetModule,
    DialogModule,
    InputMaskModule,
    ChartModule
]

const DECLARATIONS = [
    PagesLayoutComponent,
    CRUDComponent,
    WindowComponent,
    TextInputComponent,
    BooleanInputComponent,
    DateInputComponent,
    KeyInputComponent,
    MultipleReferenceInputComponent,
    NumberInputComponent,
    SelectInputComponent,
    SidebarSearchInputComponent,
    TextAreaInputComponent,
    TimeInputComponent,
    DetailTableComponent,
    DateMaskDirective,
    MultiSelectInputComponent,
    ReferenceInputComponent,
    DoughnutComponent,
    CambiarContrasenha
]

const MATERIAL = [
    MatIconModule
]

@NgModule({
    declarations: [
        ...DECLARATIONS,
        DoughnutComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ...PRIMENG,
        ...MATERIAL
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ...PRIMENG,
        ...DECLARATIONS,
        ...MATERIAL
    ],
    providers: [
        MessageService,
        ConfirmationService
    ]
})
export class SharedModule { }
