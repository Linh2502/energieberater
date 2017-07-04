import { Injectable } from "@angular/core";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';

@Injectable()
export class HouseHoldService {
    households: any = [];
    selectedHouseHold: any = null;
    efficacyTable: any;

    constructor(
        private sqlite: SQLite,
        private http: Http
    ) {

    }

    loadHouseHoldsFromStorage(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.sqlite.create({
                name: 'energieberater.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                db.executeSql('create table if not exists Households (key, value)', {})
                    .then(() => { }, (err) => console.error('Unable to execute sql: ', err));
                db.executeSql('select * from Households', {})
                    .then((resp) => {
                        if (resp.rows.length > 0) {
                            for (let index = 0; index < resp.rows.length; index++) {
                                let household = JSON.parse(resp.rows.item(index).value);

                                if (household.isSelected === undefined || household.isSelected === null) {
                                    household.isSelected = false;
                                } else {
                                    household.isSelected = false;
                                }

                                if (!household.consumers) {
                                    household.consumers = [];
                                }

                                this.households.push(household);
                            }
                            resolve();
                            db.close();
                        } else {
                            resolve();
                            db.close();
                        }
                    }).catch((res) => console.error("error select", res));
            }, (err) => {
                console.error('Unable to open database: ', err);
                reject();
            });
        });
    }

    loadEfficacyTable(): void {
        this.http.get('./assets/json.files/efficacytable.json')
            .map(res => res.json())
            .subscribe(data => {
                this.efficacyTable = data;
            }, (err) => {
                console.error("error: ", err);
            })
    }

    get houseHolds(): Array<any> {
        return this.households;
    }

    set houseHolds(households) {
        this.households = households;
    }

    set singleHouseHold(household) {
        this.selectedHouseHold = household;
    }

    get singleHouseHold(): any {
        return this.selectedHouseHold;
    }

    analyzeHouseHold(household): any {
        for (let buildingType of this.efficacyTable) {
            if (buildingType.name === household.type) {
                for (let waterType of buildingType.waterType) {
                    if (waterType.name === household.water) {
                        for (let person of waterType.persons) {
                            if (person.number === household.number) {
                                for (let houseHoldType of person.class) {
                                    if (household.yearConsumption <= houseHoldType.maxNumber) {
                                        return houseHoldType;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
