import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { ConsumptionPage } from '../consumption/consumption';
import { StatisticsPage } from '../statistics/statistics';
import { ChallengesPage } from "../challenges/challenges";

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    home = HomePage;
    consumption = ConsumptionPage;
    statistics = StatisticsPage;
    challenges = ChallengesPage;

    constructor() {

    }
}
