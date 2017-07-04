import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ChallengesService } from "../../../services/challenges.service";

@Component({
    selector: 'lessons',
    templateUrl: 'lessons.html'
})
export class LessonsPage {
    lessons: any;

    constructor(
        public navCtrl: NavController,
        public challengesService: ChallengesService
    ) {

    }

    ionViewWillEnter() {
        this.lessons = this.challengesService.lessonsData;

        for (let lesson of this.lessons) {
            lesson.hidden = true;
        }
    }

    showLessons(lesson) {
        lesson.hidden = !lesson.hidden;
    }
}
