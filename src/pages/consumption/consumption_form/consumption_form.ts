import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';

@Component({
    selector: 'consumption-form',
    templateUrl: 'consumption_form.html'
})
export class ConsumptionFormPage {
    household: any = {};
    mode: string = '';

    constructor(
        public navCtrl: NavController,
        public viewCtrl: ViewController,
        public params: NavParams
    ) {
        this.mode = this.params.get('mode');
        if (this.mode === 'edit') {
            this.household = this.params.get('data');
        }
    }

    dismiss(): void {
        this.viewCtrl.dismiss();
    }

    submitForm(): void {
        if (this.checkHouseHoldValues()) {
            this.household.isSelected = false;

            if (this.mode === 'create') {
                this.viewCtrl.dismiss(this.household, this.params.get('length'));
            }

            if (this.mode === 'edit') {
                this.viewCtrl.dismiss(this.household, this.params.get('index'));
            }
        }
    }

    checkHouseHoldValues(): boolean {
        return (this.household.name && this.household.type && this.household.water && this.household.number && this.household.yearConsumption && this.household.electricityPrice);
    }

    public convertToNumber(event):number {  return +event; }
}
