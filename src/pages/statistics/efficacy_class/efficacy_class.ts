import { Component } from "@angular/core";
import { HouseHoldService } from "../../../services/household.service";

@Component({
    selector: 'efficacy-class',
    templateUrl: 'efficacy_class.html'
})

export class EfficacyClassPage {
    selectedHouseHold: any = null;
    finalResult: any;

    constructor(
        private houseHoldService: HouseHoldService
    ) {
    }

    ionViewWillEnter() {
        this.selectedHouseHold = this.houseHoldService.singleHouseHold;

        if (this.selectedHouseHold) {
            this.finalResult = this.houseHoldService.analyzeHouseHold(this.selectedHouseHold);
        }
    }
}
