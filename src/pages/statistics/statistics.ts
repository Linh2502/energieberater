import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ConsumerStatisticPage } from './consumer_statistic/consumer_statistic';
import { OverallStatisticPage } from './overall_statistic/overall_statistic';
import { EfficacyClassPage } from './efficacy_class/efficacy_class';
import 'chart.piecelabel.js';

@Component({
    selector: 'statistics',
    templateUrl: 'statistics.html'
})
export class StatisticsPage {
    consumerStatistic: any = ConsumerStatisticPage;
    overallStatistic: any = OverallStatisticPage;
    efficacyClass: any = EfficacyClassPage;

    constructor(public navCtrl: NavController) {

    }
}
