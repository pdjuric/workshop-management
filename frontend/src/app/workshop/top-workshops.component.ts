import {Component, OnInit} from '@angular/core';
import {WorkshopService} from "../workshop.service";
import {Workshop} from "../models/workshop";

@Component({
    selector: 'top-workshops',
    templateUrl: './top-workshops.component.html'
})
export class TopWorkshopsComponent implements OnInit {

    topWorkshops: { rank: number, workshop: Workshop }[];

    constructor(private workshopService: WorkshopService) {
    }

    ngOnInit(): void {
        this.workshopService.getTop().subscribe((data: any) => {
            this.topWorkshops = []
            for (let d of data)
                this.topWorkshops.push({rank: d.no, workshop: new Workshop(d)});
            console.log(this.topWorkshops)
        });
    }

}
