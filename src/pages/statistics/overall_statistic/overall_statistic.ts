import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Chart } from 'chart.js';
import 'chart.piecelabel.js';

@Component({
    selector: 'overall-statistics',
    templateUrl: 'overall_statistic.html'
})
export class OverallStatisticPage {
    @ViewChild('piechart') pieChart;

    constructor(public navCtrl: NavController) {

    }

    ionViewDidLoad() {
        this.pieChart = new Chart(this.pieChart.nativeElement, {

            type: 'doughnut',
            data: {
                labels: ["Informationstechnik sowie TV und Audio", "Kühl- und Gefriergeräte", "Kochen", "Sonstiges", "Licht", "Spülen", "Waschen und Trocknen"],
                datasets: [{
                    data: [27, 17, 11, 16, 9, 7, 13],
                    backgroundColor: [
                        '#1495CF',
                        '#58A8DB',
                        '#8DBDE5',
                        '#BCD6EF',
                        '#98b5d1',
                        '#E0ECF8',
                        '#BCD6EF'
                    ],
                    hoverBackgroundColor: [
                        '#1495CF',
                        '#58A8DB',
                        '#8DBDE5',
                        '#BCD6EF',
                        '#98b5d1',
                        '#E0ECF8',
                        '#BCD6EF'
                    ]
                }]
            },
            options: {
                responsive: false,
                animation: {
                    animateScale: true
                },
                legend: {
                    position: 'bottom'
                },
                cutoutPercentage: 30,
                pieceLabel: {
                    // mode 'label', 'value' or 'percentage', default is 'percentage'
                    mode: 'percentage',

                    // precision for percentage, default is 0
                    precision: 2,

                    // font size, default is defaultFontSize
                    fontSize: 12,

                    // font color, default is '#fff'
                    fontColor: '#fff',

                    // font style, default is defaultFontStyle
                    fontStyle: 'normal',

                    // font family, default is defaultFontFamily
                    fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

                    // position to draw label, available value is 'default', 'border' and 'outside'
                    // default is 'default'
                    position: 'default'
                }
            }

        });
    }
}
