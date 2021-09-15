import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import ChartDataLabels  from 'chartjs-plugin-datalabels';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss', './primeng-overrides.scss']
})
export class AppComponent implements OnInit {
    title = 'examen2021';

    constructor(
        private config: PrimeNGConfig,
        private translateService: TranslateService,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        this.translateService.setDefaultLang('es');
        this.translate('es');
        Chart.register(ChartDataLabels)
    }

    translate(lang: string) {
        this.translateService.use(lang);
        this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
        this.translatePrimeNg();
    }

    async translatePrimeNg(): Promise<void> {
        registerLocaleData( es );
        const resp: any = await this.http.get('assets/language_es.json', {headers: {}}).toPromise();
        this.config.setTranslation(resp.primeng);
    }
}
