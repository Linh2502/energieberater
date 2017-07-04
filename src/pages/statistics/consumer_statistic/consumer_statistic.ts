import { Component, ViewChild } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { Chart } from 'chart.js';
import 'chart.piecelabel.js';
import { HouseHoldService } from "../../../services/household.service";

@Component({
    selector: 'consumer-statistics',
    templateUrl: 'consumer_statistic.html'
})
export class ConsumerStatisticPage {
    @ViewChild('piechart') pieChart;
    households: any = [];

    selectedHouseHold: any;
    informationSystems: Array<any> = [];
    freezingSystems: Array<any> = [];
    kitchenSystems: Array<any> = [];
    miscellaneousSystems: Array<any> = [];
    lightSystems: Array<any> = [];
    cleaningSystems: Array<any> = [];
    clothSystems: Array<any> = [];

    sumOfAllSystems: number = 0;
    sumOfInformationSystems: number = 0;
    sumOfFreezingSystems: number = 0;
    sumOfKitchenSystems: number = 0;
    sumOfMiscellaneousSystems: number = 0;
    sumOfLightSystems: number = 0;
    sumOfCleaningSystems: number = 0;
    sumOfClothSystems: number = 0;

    constructor(
        public navCtrl: NavController,
        private houseHoldService: HouseHoldService,
        public loadingCtrl: LoadingController
    ) {

    }

    ionViewWillEnter() {
        this.households = this.houseHoldService.houseHolds;
    }

    setPieChart(): void {
        this.houseHoldService.singleHouseHold = this.selectedHouseHold;

        let loading = this.loadingCtrl.create({
            content: 'Grafik wird geladen...'
        });

        loading.present();

        this.resetValues();
        this.calculateSumOfSystems(this.selectedHouseHold);

        let data = [this.getPercentageOfSystem(this.sumOfInformationSystems), this.getPercentageOfSystem(this.sumOfFreezingSystems),
            this.getPercentageOfSystem(this.sumOfKitchenSystems), this.getPercentageOfSystem(this.sumOfMiscellaneousSystems),
            this.getPercentageOfSystem(this.sumOfLightSystems), this.getPercentageOfSystem(this.sumOfCleaningSystems), this.getPercentageOfSystem(this.sumOfClothSystems)];

        if (this.pieChart.nativeElement) {
            this.pieChart = new Chart(this.pieChart.nativeElement, {
                type: 'doughnut',
                data: {
                    labels: ["Informationstechnik sowie TV und Audio", "Kühl- und Gefriergeräte", "Kochen", "Sonstiges", "Licht", "Spülen", "Waschen und Trocknen"],
                    datasets: [{
                        data: data,
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
        } else {
            this.removeExistingChart(this.pieChart);
            this.updateExistingChart(this.pieChart, data);
        }


        setTimeout(() => {
            loading.dismiss();
        }, 2000);
    }

    calculateSumOfSystems(household): void {
        if (household.consumers) {
            for (let consumer of household.consumers) {
                if (consumer.category === 'Informationstechnik sowie TV und Audio') {
                    this.informationSystems.push(consumer)
                }
                if (consumer.category === 'Kühl- und Gefriergeräte') {
                    this.freezingSystems.push(consumer)
                }
                if (consumer.category === 'Kochen') {
                    this.kitchenSystems.push(consumer)
                }
                if (consumer.category === 'Sonstiges') {
                    this.miscellaneousSystems.push(consumer)
                }
                if (consumer.category === 'Licht') {
                    this.lightSystems.push(consumer)
                }
                if (consumer.category === 'Spülen') {
                    this.cleaningSystems.push(consumer)
                }
                if (consumer.category === 'Waschen und Trocknen') {
                    this.clothSystems.push(consumer)
                }
                this.sumOfAllSystems+=consumer.yearConsumption;
            }

            for (let system of this.informationSystems) {
                this.sumOfInformationSystems+=system.yearConsumption;
            }

            for (let system of this.freezingSystems) {
                this.sumOfFreezingSystems+=system.yearConsumption;
            }

            for (let system of this.kitchenSystems) {
                this.sumOfKitchenSystems+=system.yearConsumption;
            }

            for (let system of this.miscellaneousSystems) {
                this.sumOfMiscellaneousSystems+=system.yearConsumption;
            }

            for (let system of this.lightSystems) {
                this.sumOfLightSystems+=system.yearConsumption;
            }

            for (let system of this.cleaningSystems) {
                this.sumOfCleaningSystems+=system.yearConsumption;
            }

            for (let system of this.clothSystems) {
                this.sumOfClothSystems+=system.yearConsumption;
            }
        }
    }

    getPercentageOfSystem(system): number {
        return (system / this.sumOfAllSystems * 100);
    }

    resetValues(): void {
        this.informationSystems = [];
        this.freezingSystems = [];
        this.kitchenSystems= [];
        this.miscellaneousSystems = [];
        this.lightSystems = [];
        this.cleaningSystems = [];
        this.clothSystems = [];

        this.sumOfAllSystems= 0;
        this.sumOfInformationSystems = 0;
        this.sumOfFreezingSystems = 0;
        this.sumOfKitchenSystems = 0;
        this.sumOfMiscellaneousSystems = 0;
        this.sumOfLightSystems = 0;
        this.sumOfCleaningSystems = 0;
        this.sumOfClothSystems = 0;
    }

    removeExistingChart(chart): void {
        chart.data.datasets.forEach((dataset) => {
            dataset.data.splice(0, 7);
        });
    }

    updateExistingChart(chart, data): void {
        chart.data.datasets.forEach((dataset) => {
            data.forEach((one) => {
                dataset.data.push(one);
            });
        });
        chart.update();
    }
}
