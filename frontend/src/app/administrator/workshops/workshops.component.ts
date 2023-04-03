import {Component, OnInit} from '@angular/core';
import {Workshop} from "../../models/workshop";

@Component({
    selector: 'app-workshops-admin', templateUrl: './workshops.component.html'
})
export class WorkshopsComponent implements OnInit {
    allWorkshops: Workshop[] = [];

    ngOnInit(): void {
    }

    edit(workshop: Workshop) {

    }

    delete(workshop: Workshop) {

    }

}
