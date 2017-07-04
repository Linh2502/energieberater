import { Component, Input } from '@angular/core';

@Component({
    selector: 'progress-bar',
    templateUrl: 'progress_bar.html'
})
export class ProgressBarComponent {

    @Input('progress') progress;
    @Input('points') currentPoints;
    @Input('level') nextLevel;

    constructor() {

    }

}
