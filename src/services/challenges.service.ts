import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import 'rxjs/add/operator/map';

@Injectable()
export class ChallengesService {
    quests: any;
    questsFromStorage: any = [];
    lessons: any;
    lessonsFromStorage: any = [];
    achievements: any;

    level: any = {
        currentPoints: 0,
        currentLevel: 1,
        pointsForNextLevel: 500,
        currentPointsInPercent: 0,
        questsCompleted: 0
    };

    constructor(
        private http: Http,
        private sqlite: SQLite
    ) {

    }

    loadQuestsFromStorage(): Promise<any> {
        this.questsFromStorage = [];
        return new Promise((resolve, reject) => {
            this.sqlite.create({
                name: 'energieberater.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                db.executeSql('create table if not exists Quests (key, value)', {})
                    .then(() => { }, (err) => console.error('Unable to execute sql: ', err));
                db.executeSql('select * from Quests', {})
                    .then((resp) => {
                        if (resp.rows.length > 0) {
                            for (let index = 0; index < resp.rows.length; index++) {
                                let quest = JSON.parse(resp.rows.item(index).value);
                                this.questsFromStorage.push(quest);
                            }
                        }
                        resolve();
                        db.close();
                    }).catch((res) => {
                        reject();
                        console.error("error select", res)
                    });
            }, (err) => {
                reject();
                console.error('Unable to open database: ', err)
            });
        })
    }

    loadQuests(): void {
        this.http.get('./assets/json.files/quests.json')
            .map(res => res.json())
            .subscribe(data => {
                this.quests = data;
            }, (err) => {
                console.error("error: ", err);
            });
    }

    get questsData(): Array<any> {
        return this.quests;
    }

    set questsData(quests) {
        this.quests = quests;
    }

    get questsFromStorageData(): Array<any> {
        return this.questsFromStorage;
    }

    loadLessonsFromStorage(): void {
        this.sqlite.create({
            name: 'energieberater.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql('create table if not exists Quests (key, value)', {})
                .then(() => { }, (err) => console.error('Unable to execute sql: ', err));
            db.executeSql('select * from Quests', {})
                .then((resp) => {
                    if (resp.rows.length > 0) {
                        for (let index = 0; index < resp.rows.length; index++) {
                            let lesson = JSON.parse(resp.rows.item(index).value);

                            lesson.isOpen = false;
                            if (lesson.completed === undefined || lesson.completed === null) {
                                lesson.completed = false;
                            }

                            this.lessonsFromStorage.push(lesson);
                        }
                    }
                    db.close();
                }).catch((res) => console.error("error select", res));
        }, (err) => console.error('Unable to open database: ', err));
    }

    loadLessons(): void {
        this.http.get('./assets/json.files/lessons.json')
            .map(res => res.json())
            .subscribe(data => {
                this.lessons = data;
            }, (err) => {
                console.error("error: ", err);
            })
    }

    get lessonsData(): Array<any> {
        return this.lessons;
    }

    get lessonsFromStorageData(): Array<any> {
        return this.lessonsFromStorage;
    }

    get levelData(): any {
        return this.level;
    }

    set levelData(level) {
        this.level = level;
    }

    setInitialLevel(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.sqlite.create({
                name: 'energieberater.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                db.executeSql('create table if not exists System (key, value)', {})
                    .then(() => { }, (err) => console.error('Unable to execute sql: ', err));
                db.executeSql('select * from System', {})
                    .then((resp) => {
                        if (resp.rows.length <= 0) {
                            this.level = {
                                currentPoints:  0,
                                currentLevel: 1,
                                pointsForNextLevel: 500,
                                currentPointsInPercent: 0,
                                completedQuests: 0
                            };
                            db.executeSql('insert into System values(?,?)', [0, JSON.stringify(this.level)])
                                .then((res) => {
                                    console.info("response", res);
                                    this.levelData = this.level;
                                    resolve(this.level);
                                    db.close();
                                })
                                .catch((err) => {
                                    reject();
                                    console.info("error", err);
                                })
                        } else {
                            this.levelData = JSON.parse(resp.rows.item(0).value);
                            resolve(JSON.parse(resp.rows.item(0).value));
                            db.close();
                        }
                    }).catch((res) => {
                    console.error("error select", res);
                    reject();
                });
            }, (err) => {
                console.error('Unable to open database: ', err);
                reject();
            });
        })
    }

    loadAchievements(): void {
        this.http.get('./assets/json.files/achievements.json')
            .map(res => res.json())
            .subscribe(data => {
                this.achievements = data;
            }, (err) => {
                console.error("error: ", err);
            });
    }

    get achievementsData(): any {
        return this.achievements;
    }
}
