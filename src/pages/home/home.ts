import { Component} from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { ChallengesService } from "../../services/challenges.service";
import { HouseHoldService } from "../../services/household.service";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    level: any = {
        currentPoints: 0,
        currentLevel: 1,
        pointsForNextLevel: 500,
        currentPointsInPercent: 0,
        questsCompleted: 0
    };

    quests: any;
    households: any;
    sum: number = 0;

    achievements: any = [];

    constructor(
        public navCtrl: NavController,
        private challengesService: ChallengesService,
        private householdService: HouseHoldService,
        events: Events
    ) {
        //this is necessary to update level because of async calls
        events.subscribe('level set', (level) => {
            this.level = level;
        });

        events.subscribe('achievements set', (response) => {
            this.setAchievements();
        });
    }

    ionViewWillEnter() {
        this.setAchievements();
    }

    setAchievements(): void {
        this.level = this.challengesService.levelData;
        this.quests = this.challengesService.questsFromStorageData;
        this.households = this.householdService.houseHolds;
        this.achievements = this.challengesService.achievementsData;

        this.sum = 0;

        if (this.achievements) {
            for (let type of this.achievements[0].level) {
                if (!this.achievements[0].current && !this.achievements[0].sum) {
                    this.achievements[0].current = type.name;
                    this.achievements[0].sum = 0;
                } else {
                    if (this.level.completedQuests >= type.requirement) {
                        this.achievements[0].current = type.name;
                        this.achievements[0].sum = this.level.completedQuests;
                    }
                }
            }

            for (let type of this.achievements[1].level) {
                if (!this.achievements[1].current && !this.achievements[1].sum) {
                    this.achievements[1].current = type.name;
                    this.achievements[1].sum = 0;
                } else {
                    if (this.households.length >= type.requirement) {
                        this.achievements[1].current = type.name;
                        this.achievements[1].sum = this.households.length;
                    }
                }
            }

            for (let household of this.households) {
                if (household.consumers) {
                    this.sum += household.consumers.length;
                }
            }

            for (let type of this.achievements[2].level) {
                if (!this.achievements[2].current && !this.achievements[2].sum) {
                    this.achievements[2].current = type.name;
                    this.achievements[2].sum = 0;
                } else {
                    if (this.sum >= type.requirement) {
                        this.achievements[2].current = type.name;
                        this.achievements[2].sum = this.sum;
                    }
                }
            }
        }
    }
}
