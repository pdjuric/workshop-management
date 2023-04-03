import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {imageUri} from "../../utils";

@Component({
    selector: 'user-card', template: `
        <div class="card m-2">
            <img [src]="imagePath" class="card-img-top">

            <div class="card-body">
                <p class="card-text my-1"> First name: {{user.first_name}} </p>
                <p class="card-text my-1"> Last name: {{user.last_name}} </p>
                <p class="card-text my-1"> Username: {{user.username}} </p>
                <p class="card-text my-1"> Telephone: {{user.telephone}} </p>
                <p class="card-text my-1"> Email: {{user.email}} </p>
                <p class="card-text my-1"> Type: {{user.user_type}} </p>

                <p class="card-text my-1" *ngIf="user.user_type == 'organizer'"> Organization
                    name: {{user.org_name}} </p>
                <p class="card-text my-1" *ngIf="user.user_type == 'organizer'"> Country: {{user.org_country}} </p>
                <p class="card-text my-1" *ngIf="user.user_type == 'organizer'"> City: {{user.org_city}} </p>
                <p class="card-text my-1" *ngIf="user.user_type == 'organizer'"> Street: {{user.org_street}} </p>
                <p class="card-text my-1" *ngIf="user.user_type == 'organizer'"> Number: {{user.org_number}} </p>
                <p class="card-text my-1" *ngIf="user.user_type == 'organizer'"> Organization reg.
                    num.: {{user.org_rn}} </p>


                <button *ngIf="includeButton1" class="btn btn-light w-100"
                        (click)="buttonCallback1(user.username)" [innerHTML]="buttonCaption1"></button>

                <button *ngIf="includeButton2" class="btn btn-light w-100 mt-2"
                        (click)="buttonCallback2(user.username)" [innerHTML]="buttonCaption2"></button>

            </div>
        </div>
    `
})
export class UserCardComponent implements OnInit {

    @HostBinding('class') classes = 'col-12 col-md-4 col-lg-3 p-0 m-0';
    @Input() user: any;
    @Input() buttonCaption1: string;
    @Input() includeButton1: boolean;
    @Input() buttonCallback1: (any) => void;
    @Input() buttonCaption2: string;
    @Input() includeButton2: boolean;
    @Input() buttonCallback2: (any) => void;

    constructor() {
    }

    get imagePath(): string {
        return imageUri + this.user.image
    }

    ngOnInit(): void {
    }

}
