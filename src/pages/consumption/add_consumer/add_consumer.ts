import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';

@Component({
    selector: 'add-consumer',
    templateUrl: 'add_consumer.html'
})
export class AddConsumerFormPage {
    consumer: any = {};
    mode: string = '';

    constructor(
        public navCtrl: NavController,
        public viewCtrl: ViewController,
        public params: NavParams
    ) {
        this.mode = this.params.get('mode');
        if (this.mode === 'edit') {
            this.consumer = this.params.get('data');
        }
    }

    dismiss(): void {
        this.viewCtrl.dismiss();
    }

    submitForm(): void {
        if (this.checkConsumerValues(this.consumer)) {
            this.viewCtrl.dismiss(this.consumer, this.params.get('index'));
        }
    }

    checkConsumerValues(consumer): boolean {
        if (consumer.name && consumer.category) {
            if (consumer.power && consumer.consumptionPerDay) {
                consumer.yearConsumption = (consumer.power * consumer.consumptionPerDay * 365) / 1000;
            }

            return consumer.yearConsumption;
        } else {
            return false;
        }
    }

    public convertToNumber(event):number {  return +event; }
}
