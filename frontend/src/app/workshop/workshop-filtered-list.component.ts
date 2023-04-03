import {Component, OnInit} from '@angular/core';
import {Workshop} from "../models/workshop";
import {WorkshopService} from "../workshop.service";
import {Router} from "@angular/router";
import {getUser} from "../utils";

@Component({
    selector: 'workshop-filtered-list',
    templateUrl: './workshop-filtered-list.component.html'
})
export class WorkshopFilteredListComponent implements OnInit {

    username: string = '';
    isOrganizer: boolean = false;
    loggedIn: boolean = false;
    workshops: Workshop[] = [];
    sortedWorkshops: Workshop[] = [];
    nameFilter: string = '';
    placeFilter: string = '';
    currentSort: string = "none";

    constructor(private workshopService: WorkshopService, private router: Router) {
        let user = getUser();
        if (user == null) return
        this.loggedIn = true;
        this.username = user.username
        this.isOrganizer = user.user_type == 'organizer'
    }

    get more() {
        return this._more.bind(this);
    }

    get edit() {
        return this._edit.bind(this);
    }

    get manageApplication() {
        return this._manageApplication.bind(this);
    }

    get save() {
        return this._save.bind(this);
    }

    get cancel() {
        return this._cancel.bind(this);
    }

    ngOnInit(): void {
        this.fetch();
    }

    fetch() {
        this.workshopService.getActive().subscribe((data: any[]) => {
            this.sortedWorkshops = this.workshops = data.map(d => new Workshop(d));
        });
    }

    sortWorkshops() {
        this.sortedWorkshops = [...this.workshops];
        if (this.currentSort != "none")
            this.sortedWorkshops.sort((a, b) =>
                (this.currentSort == "place") ? a.place.localeCompare(b.place) : a.name.localeCompare(b.name)
            )
    }

    any() {
        for (let w of this.sortedWorkshops)
            if (this.satisfiesFilter(w))
                return true;

        return false;
    }

    satisfiesFilter(w: Workshop) {
        return w.name.toLowerCase().includes(this.nameFilter.toLowerCase()) &&
            w.place.toLowerCase().includes(this.placeFilter.toLowerCase())
    }

    _more(w: Workshop) {
        this.router.navigate(['/workshop-details', w.idWorkshop])
    }

    _edit(w: Workshop) {
        this.router.navigate(['/workshop-edit', w.idWorkshop])
    }

    _manageApplication(w: Workshop) {
        this.router.navigate(['/workshop-applications', w.idWorkshop])
    }

    _save(w: Workshop) {
        this.workshopService.getTemplate(w.idWorkshop).subscribe((data: any) => {
            let date = new Date(data.dateTime)
            date.setHours(date.getHours() + 1)
            data.dateTime = date
            console.log(JSON.stringify(data))
            let b = new Blob([JSON.stringify(data)], {type: 'text/json'})

            const link = document.createElement("a");
            link.href = URL.createObjectURL(b);
            link.download = 'workshop_template.json'
            link.click();
            link.remove();

        })
    }

    _cancel(w: Workshop) {
        this.workshopService.cancel(w.idWorkshop).subscribe(data => this.fetch())
    }


}
