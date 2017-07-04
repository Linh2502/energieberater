import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { QuestsPage } from "./quests/quests";
import { LessonsPage } from "./lessons/lessons";

@Component({
    selector: 'challenges',
    templateUrl: 'challenges.html'
})
export class ChallengesPage {
    quests: any = QuestsPage;
    lessons: any = LessonsPage;

    constructor(public navCtrl: NavController) {

    }

}
