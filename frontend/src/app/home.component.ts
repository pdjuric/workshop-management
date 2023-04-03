import {Component, OnInit} from "@angular/core";
import {getUser} from "./utils";

@Component({
    selector: 'home', template: `
        <participant-home *ngIf="role == 'participant'"></participant-home>
        <organizer-home *ngIf="role == 'organizer'"></organizer-home>
        <administrator-home *ngIf="role == 'admin'"></administrator-home>
        <guest-home *ngIf="role == 'guest'"></guest-home>
    `
})
export class HomeComponent implements OnInit {

    get role() {
        let user = getUser();

        if (user == null) return 'guest';
        return user.user_type;
    }

    ngOnInit(): void {
    }
}
