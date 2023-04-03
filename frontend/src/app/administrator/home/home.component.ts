import {Component, OnInit} from '@angular/core';
import {UserService} from "../../user.service";
import {Router} from "@angular/router";
import {Workshop} from "../../models/workshop";
import {WorkshopService} from "../../workshop.service";
import {getUser} from "../../utils";

@Component({
    selector: 'admin-home', templateUrl: './home.component.html'
})
export class AdminHomeComponent implements OnInit {
    pending_users: any = [];
    active_users: any = [];
    username: string;
    pendingWorkshops: Workshop[] = [];
    allWorkshops: Workshop[] = [];

    constructor(private userService: UserService, private router: Router, private workshopService: WorkshopService) {
        this.username = getUser().username
    }

    get editWorkshop() {
        return this._editWorkshop.bind(this);
    }

    get manageApplication() {
        return this._manageApplication.bind(this);
    }

    //'edit-user/:username'

    get save() {
        return this._save.bind(this);
    }

    get cancel() {
        return this._cancel.bind(this);
    }

    ngOnInit(): void {
        this.fetchUsers();
        this.fetchWorkshops();
    }

    accept(username: any) {
        this.userService.update_status(username, 'active').subscribe(data => this.fetchUsers())
    }

    decline(username: any) {
        this.userService.update_status(username, 'declined').subscribe(data => this.fetchUsers())
    }

    fetchUsers() {
        this.userService.getPending().subscribe(data => {
            this.pending_users = data
        })

        this.userService.getActive().subscribe(data => {
            this.active_users = data
        })
    }

    edit(username: string) {
        this.router.navigate(['edit-user', username])
    }

    delete(username: string) {
        this.userService.delete(username).subscribe(data => this.fetchUsers())
    }

    fetchWorkshops() {
        this.workshopService.pending().subscribe((data: any[]) => {
            this.pendingWorkshops = data.map(t => new Workshop(t));
        })
        this.workshopService.getActive().subscribe((data: any[]) => {
            this.allWorkshops = data.map(d => new Workshop(d));
        });
    }

    acceptWorkshop(w: Workshop) {
        this.workshopService.accept(w.idWorkshop).subscribe(data => this.fetchWorkshops())
    }

    rejectWorkshop(w: Workshop) {
        this.workshopService.reject(w.idWorkshop).subscribe(data => this.fetchWorkshops())
    }

    toChat(w: Workshop) {
        this.router.navigate(['workshop-messages', w.idWorkshop])
    }

    _editWorkshop(w: Workshop) {
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

            let b = new Blob([JSON.stringify(data)], {type: 'text/json'})

            const link = document.createElement("a");
            link.href = URL.createObjectURL(b);
            link.download = 'workshop_template.json'
            link.click();
            link.remove();

        })
    }

    _cancel(w: Workshop) {
        this.workshopService.cancel(w.idWorkshop).subscribe(data => this.fetchWorkshops())
    }


}
