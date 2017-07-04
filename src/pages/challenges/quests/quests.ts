import { Component } from '@angular/core';
import { Events, NavController, ToastController } from 'ionic-angular';
import { ChallengesService } from "../../../services/challenges.service";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";

@Component({
    selector: 'quests',
    templateUrl: 'quests.html'
})
export class QuestsPage {
    quests: any;
    questsFromDataBase: any;

    constructor(
        public navCtrl: NavController,
        public challengesService: ChallengesService,
        private sqlite: SQLite,
        public events: Events,
        private toastCtrl: ToastController
    ) {

    }

    ionViewWillEnter() {
        this.quests = this.challengesService.questsData;
        this.challengesService.loadQuestsFromStorage()
            .then(() => {
                this.questsFromDataBase = this.challengesService.questsFromStorageData;

                for (let quest of this.quests) {
                    for (let questFromDataBase of this.questsFromDataBase) {
                        if (quest.id === questFromDataBase.id) {
                            quest.completed = questFromDataBase.completed;
                        }
                    }
                }
            });
    }

    openQuestDescription(quest): void {
        quest.isOpen = !quest.isOpen;
    }

    setQuestState(quest, index): void {
        quest.isOpen = false;
        this.sqlite.create({
            name: 'energieberater.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql('create table if not exists Quests (key, value)', {})
                .then(() => { }, (err) => console.error('Unable to execute sql: ', err));
            db.executeSql('select * from Quests', {})
                .then((resp) => {
                    if (resp.rows.length > 0) {
                        this.checkIfQuestAlreadyExists(resp, quest)
                            .then((success) => {
                                let sql = 'update Quests set value = ? where key = ?';

                                db.executeSql(sql, [JSON.stringify(success), index])
                                    .then((res) => {
                                        console.info("response", res);
                                        db.close()
                                            .then(() => {
                                                if (quest.completed) {
                                                    this.setLevel(quest, true);
                                                } else {
                                                    this.setLevel(quest, false);
                                                }
                                            });
                                    })
                                    .catch((err) => {
                                        console.info("error", err);
                                    });
                            }, (error) => {
                                error.completed = true;
                                db.executeSql('insert into Quests values(?,?)', [index, JSON.stringify(error)])
                                    .then((res) => {
                                        console.info("response", res);
                                        db.close()
                                            .then(() => {
                                                if (quest.completed) {
                                                    this.setLevel(quest, true);
                                                } else {
                                                    this.setLevel(quest, false);
                                                }
                                            });
                                    })
                                    .catch((err) => {
                                        console.info("error", err);
                                    })
                            });
                    } else {
                        let savedQuestObject = {
                            name: quest.name,
                            id: quest.id,
                            completed: true,
                            points: quest.points
                        };

                        db.executeSql('insert into Quests values(?,?)', [index, JSON.stringify(savedQuestObject)])
                            .then((res) => {
                                console.info("response", res);
                                db.close()
                                    .then(() => {
                                        this.setLevel(quest, true);
                                    });
                            })
                            .catch((err) => {
                                console.info("error", err);
                            })
                    }
                }).catch((res) => console.error("error select", res));
        }, (err) => console.error('Unable to update database: ', err));
    }

    checkIfQuestAlreadyExists(response, quest): Promise<any> {
        return new Promise((resolve, reject) => {
            let savedQuestObject = {
                name: quest.name,
                id: quest.id,
                completed: quest.completed,
                points: quest.points
            };

            let index;
            for (index = 0; index < response.rows.length; index++) {
                let getQuestFromDatabase = JSON.parse(response.rows.item(index).value);

                if (quest.id === getQuestFromDatabase.id) {

                    resolve(savedQuestObject);
                }
            }
            if (index === response.rows.length) {
                reject(savedQuestObject);
            }
        })
    }

    setLevel(quest, shouldAddToPoints: boolean): void {
        this.sqlite.create({
            name: 'energieberater.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            let sql = 'update System set value = ? where key = ?';
            let level = this.challengesService.levelData;
            let hasBeenLevelUp: boolean = false;

            if (shouldAddToPoints) {
                level.currentPoints += quest.points;
                level.completedQuests += 1;

                if (level.currentPoints >= level.pointsForNextLevel) {
                    level.pointsForNextLevel *= 2;
                    level.currentLevel += 1;
                    hasBeenLevelUp = true;
                }
            } else {
                level.currentPoints -= quest.points;
                level.completedQuests -= 1;

                if (level.currentPoints <= (level.pointsForNextLevel/2)) {
                    if ((level.pointsForNextLevel/2) >= 500) {
                        level.pointsForNextLevel /= 2;
                        level.currentLevel -= 1;
                    }
                }
            }

            level.currentPointsInPercent = level.currentPoints / level.pointsForNextLevel * 100;

            db.executeSql(sql, [JSON.stringify(level), 0])
                .then((res) => {
                    console.info("response", res);
                    this.challengesService.levelData = level;
                    this.events.publish('level set', level);
                    if (shouldAddToPoints) {
                        this.showNotification(quest.points, hasBeenLevelUp);
                    }
                    db.close();
                })
                .catch((err) => {
                    console.info("error", err);
                    db.close();
                });
        }, (err) => console.error('Unable to open database: ', err));
    }

    showNotification(points, hasBeenLevelUp): void {
        let toast;
        if (hasBeenLevelUp) {
            toast = this.toastCtrl.create({
                message: 'Herzlichen Glückwunsch, Sie haben eine neue Stufe erreicht!',
                duration: 3000,
                position: 'top',
                cssClass: "toast-background"
            });
        } else {
            toast = this.toastCtrl.create({
                message: 'Herzlichen Glückwunsch, Sie haben soeben ' + points + ' Punkte bekommen!',
                duration: 3000,
                position: 'top'
            });
        }

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }
}
