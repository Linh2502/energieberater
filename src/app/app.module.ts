import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ConsumptionPage } from '../pages/consumption/consumption';
import { ConsumptionFormPage } from '../pages/consumption/consumption_form/consumption_form';
import { AddConsumerFormPage } from '../pages/consumption/add_consumer/add_consumer';
import { StatisticsPage } from '../pages/statistics/statistics';
import { ConsumerStatisticPage } from '../pages/statistics/consumer_statistic/consumer_statistic';
import { OverallStatisticPage } from '../pages/statistics/overall_statistic/overall_statistic';
import { QuestsPage } from '../pages/challenges/quests/quests';
import { LessonsPage } from '../pages/challenges/lessons/lessons';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
import { SuperTabsModule } from "ionic2-super-tabs";
import { HouseHoldService } from "../services/household.service";
import { EfficacyClassPage } from "../pages/statistics/efficacy_class/efficacy_class";
import { HttpModule } from "@angular/http";
import { ChallengesPage } from "../pages/challenges/challenges";
import { ChallengesService } from "../services/challenges.service";
import { ProgressBarComponent } from "../pages/home/progress_bar/progress_bar";

@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        TabsPage,
        ConsumptionPage,
        ConsumptionFormPage,
        AddConsumerFormPage,
        StatisticsPage,
        ConsumerStatisticPage,
        OverallStatisticPage,
        EfficacyClassPage,
        QuestsPage,
        ChallengesPage,
        LessonsPage,
        ProgressBarComponent
    ],
    imports: [
        HttpModule,
        BrowserModule,
        IonicModule.forRoot(MyApp, {}),
        SuperTabsModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        TabsPage,
        ConsumptionPage,
        ConsumptionFormPage,
        AddConsumerFormPage,
        StatisticsPage,
        ConsumerStatisticPage,
        OverallStatisticPage,
        EfficacyClassPage,
        QuestsPage,
        ChallengesPage,
        LessonsPage,
        ProgressBarComponent
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        SQLite,
        HouseHoldService,
        ChallengesService
    ]
})
export class AppModule {
}
