import { Component } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { HouseHoldService } from "../services/household.service";
import { ChallengesService } from "../services/challenges.service";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = TabsPage;

    constructor(
        platform: Platform,
        statusBar: StatusBar,
        splashScreen: SplashScreen,
        houseHoldService: HouseHoldService,
        challengesService: ChallengesService,
        events: Events
    ) {
        platform.ready().then(() => {
            statusBar.styleDefault();
            splashScreen.hide();

            houseHoldService.loadEfficacyTable();
            challengesService.loadQuests();
            challengesService.loadLessons();
            challengesService.loadAchievements();

            challengesService.setInitialLevel()
                .then((level) => {
                    //this is necessary to update level for home view because of async calls
                    events.publish('level set', level);
                    houseHoldService.loadHouseHoldsFromStorage()
                        .then(() => {
                            challengesService.loadQuestsFromStorage()
                                .then(() => {
                                    events.publish('achievements set', 'set');
                                    console.info("loaded data from storage completely");
                                });
                        }, () => {
                            console.error("error in loading initial data from storage");
                        });
                });
        });
    }
}
