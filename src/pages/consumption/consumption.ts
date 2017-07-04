import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController, Events } from 'ionic-angular';
import { ConsumptionFormPage } from './consumption_form/consumption_form';
import { AddConsumerFormPage } from './add_consumer/add_consumer';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { HouseHoldService } from "../../services/household.service";
import { ChallengesService } from "../../services/challenges.service";

@Component({
    selector: 'consumption',
    templateUrl: 'consumption.html'
})
export class ConsumptionPage {
    households: Array<any> = [];

    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public alertCtrl: AlertController,
        public events: Events,
        private sqlite: SQLite,
        private houseHoldService: HouseHoldService,
        private challengesService: ChallengesService,
        private toastCtrl: ToastController
    ) { }

    ionViewWillEnter() {
        this.loadDatabase();
    }

    loadDatabase(): void {
        this.households = this.houseHoldService.houseHolds;
    }

    public createHouseHold(length): void {
        let houseHoldModal = this.modalCtrl.create(ConsumptionFormPage, {length: length, mode: 'create'});
        houseHoldModal.present();

        houseHoldModal.onDidDismiss((data, length) => {
            if (data) {
                this.sqlite.create({
                    name: 'energieberater.db',
                    location: 'default'
                }).then((db: SQLiteObject) => {
                    let sql = 'insert into Households values(?,?)';
                    db.executeSql(sql, [length, JSON.stringify(data)])
                        .then((res) => {
                            console.info("response", res);
                            this.houseHoldService.houseHolds = this.households;
                            db.close();
                            this.addPointsToLevel();
                        })
                        .catch((err) => {
                            console.info("error", err);
                        })
                    });
                this.households.push(data);
            }
        });
    }

    public editHouseHold(household, index): void {
        let houseHoldModal = this.modalCtrl.create(ConsumptionFormPage, {data: household, mode: 'edit', index: index});
        houseHoldModal.present();

        houseHoldModal.onDidDismiss((data, index) => {
            if (data) {
                this.sqlite.create({
                    name: 'energieberater.db',
                    location: 'default'
                }).then((db: SQLiteObject) => {
                    let sql = 'update Households set value = ? where key = ?';
                    db.executeSql(sql, [JSON.stringify(data), index])
                        .then((res) => {
                            console.info("response", res);
                            db.close();
                        })
                        .catch((err) => {
                            console.info("error", err);
                        });
                });
                this.households[index] = data;
            }
        });
    }

    public deleteHouseHold(household, index): void {
        let confirm = this.alertCtrl.create({
            title: 'Haushalt löschen',
            message: 'Wollen Sie den Haushalt ' + household.name + ' wirklich löschen?',
            buttons: [
                {
                    text: 'Löschen',
                    handler: () => {
                        this.sqlite.create({
                            name: 'energieberater.db',
                            location: 'default'
                        }).then((db: SQLiteObject) => {
                            let sql = 'delete from Households where key = (?)';
                            db.executeSql(sql, [index])
                                .then((res) => {
                                    console.info("response", res);
                                    this.households.splice(index, 1);
                                    db.close();
                                })
                                .catch((err) => {
                                    console.info("error", err);
                                })
                        })
                    }
                },
                {
                    text: 'Abbrechen',
                    handler: () => {
                        console.log('Dismiss');
                    }
                }
            ]
        });
        confirm.present();
    }

    public selectHouseHold(household): void {
        household.isSelected = !household.isSelected;
    }

    public addConsumer(household, index): void {
        let addConsumerModal = this.modalCtrl.create(AddConsumerFormPage, {index: index, mode: 'create'});
        addConsumerModal.present();

        addConsumerModal.onDidDismiss((data, index) => {
            if (data) {
                if (!household.consumers) {
                    household.consumers = [];
                }
                household.consumers.push(data);
                this.sqlite.create({
                    name: 'energieberater.db',
                    location: 'default'
                }).then((db: SQLiteObject) => {
                    let sql = 'update Households set value = ? where key = ?';

                    db.executeSql(sql, [JSON.stringify(household), index])
                        .then((res) => {
                            console.info("response", res);
                            this.houseHoldService.houseHolds = this.households;
                            db.close();
                            this.addPointsToLevel();
                        })
                        .catch((err) => {
                            console.info("error", err);
                        })
                })
            }
        })
    }

    public editConsumer(household, consumer, index): void {
        let addConsumerModal = this.modalCtrl.create(AddConsumerFormPage, {data: consumer, index: index, mode: 'edit'});
        addConsumerModal.present();

        addConsumerModal.onDidDismiss((data, index) => {
            if (data) {
                household.consumers[index] = data;
                this.sqlite.create({
                    name: 'energieberater.db',
                    location: 'default'
                }).then((db: SQLiteObject) => {
                    let sql = 'update Households set value = ? where key = ?';

                    db.executeSql(sql, [JSON.stringify(household), index])
                        .then((res) => {
                            console.info("response", res);
                            db.close();
                        })
                        .catch((err) => {
                            console.info("error", err);
                        })
                });
                household.consumers[index] = data;
            }
        })
    }

    public deleteConsumer(household, index): void {
        this.sqlite.create({
            name: 'energieberater.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            household.consumers.splice(index, 1);
            this.sqlite.create({
                name: 'energieberater.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                let sql = 'update Households set value = ? where key = ?';

                db.executeSql(sql, [JSON.stringify(household), index])
                    .then((res) => {
                        console.info("response", res);
                        db.close();
                    })
                    .catch((err) => {
                        console.info("error", err);
                    })
            });
        })
    }

    //TODO: export as a service since it is a duplicate (80%) of the method showNotification() in quests.ts
    addPointsToLevel(): void {
        this.sqlite.create({
            name: 'energieberater.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            let sql = 'update System set value = ? where key = ?';
            let level = this.challengesService.levelData;
            let hasBeenLevelUp: boolean = false;

            level.currentPoints += 100;

            if (level.currentPoints >= level.pointsForNextLevel) {
                level.pointsForNextLevel *= 2;
                level.currentLevel += 1;
                hasBeenLevelUp = true;
            }

            level.currentPointsInPercent = level.currentPoints / level.pointsForNextLevel * 100;

            db.executeSql(sql, [JSON.stringify(level), 0])
                .then((res) => {
                    console.info("response", res);
                    this.challengesService.levelData = level;
                    this.events.publish('level set', level);
                    this.showNotification(hasBeenLevelUp);
                    db.close();
                })
                .catch((err) => {
                    console.info("error", err);
                    db.close();
                });
        }, (err) => console.error('Unable to open database: ', err));
    }

    //TODO: export as a service since it is a duplicate (80%) of the method showNotification() in quests.ts
    showNotification(hasBeenLevelUp: boolean): void {
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
                message: 'Herzlichen Glückwunsch, Sie haben soeben ' + 100 + ' Punkte bekommen!',
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
