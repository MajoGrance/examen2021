import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-doughnut',
    templateUrl: './doughnut.component.html',
    styleUrls: ['./doughnut.component.scss']
    })
export class DoughnutComponent implements OnInit {

    @Input() data!: IDoughnut;
    options: any;

    constructor() {
    }

    ngOnInit(): void {
        this.getOptions();
    }

    getOptions() {
        this.options = {
            plugins: {
                // title: {
                //     display: true,
                //     text: this.data.title,
                //     font: {
                //         size: 18
                //     }
                // },
                // subtitle: {
                //     display: true,
                //     text: this.data.subtitle,
                //     font: {
                //         size: 16
                //     }
                // },
                datalabels: {
                    color: '#000000',
                    font: {
                        size: 15,
                        weight: 'bold'
                    }
                },
                legend: {
                    labels: {
                        color: '#495057',
                    }
                },
            }
        }
    }

}

export interface IDoughnut {
    labels: string[];
    datasets: IDatasets[];
}


export interface IDatasets {
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
}
