import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {Workshop} from "../models/workshop";
import {imageUri} from "../utils";

@Component({
    selector: 'workshop-card',
    template: `
        <div class="card m-2">
            <img [src]="imagePath" class="card-img-top">
            <div *ngIf="overlayText != null" class="card-img-overlay card-inverse">
                <h2 class="text-stroke text-opacity-50 text-black pb-5 align-text-top text-start">
                    {{overlayText}}
                </h2>

            </div>
            <div class="card-body">
                <h5 class="card-title"> {{workshop.name}} </h5>
                <p class="card-text my-1"> Time: {{workshop.dateTime}} </p>
                <p class="card-text my-1"> Place: {{workshop.place}} </p>
                <p *ngIf="includeDescription" class="card-text"> {{workshop.description}} </p>
                <button *ngIf="includeButton1" class="btn btn-light w-100 my-1"
                        (click)="buttonCallback1(workshop)" [innerHTML]="buttonCaption1"></button>

                <button *ngIf="includeButton2" class="btn btn-light w-100 my-1"
                        (click)="buttonCallback2(workshop)" [innerHTML]="buttonCaption2"></button>

                <button *ngIf="includeButton3" class="btn btn-light w-100 my-1"
                        (click)="buttonCallback3(workshop)" [innerHTML]="buttonCaption3"></button>

                <button *ngIf="includeButton4" class="btn btn-light w-100 my-1"
                        (click)="buttonCallback4(workshop)" [innerHTML]="buttonCaption4"></button>

                <button *ngIf="includeButton5" class="btn btn-light w-100 my-1"
                        (click)="buttonCallback5(workshop)" [innerHTML]="buttonCaption5"></button>


            </div>
        </div>
    `
})
export class WorkshopCardComponent implements OnInit {

    @HostBinding('class') classes = 'col-12 col-md-4 col-lg-3 p-0 m-0';
    @Input() workshop: Workshop;
    @Input() includeDescription: boolean = true;
    @Input() overlayText: string = null;
    @Input() buttonCaption1: string;
    @Input() includeButton1: boolean;
    @Input() buttonCallback1: (Workshop) => void;
    @Input() buttonCaption2: string;
    @Input() includeButton2: boolean;
    @Input() buttonCallback2: (Workshop) => void;
    @Input() buttonCaption3: string;
    @Input() includeButton3: boolean;
    @Input() buttonCallback3: (Workshop) => void;
    @Input() buttonCaption4: string;
    @Input() includeButton4: boolean;
    @Input() buttonCallback4: (Workshop) => void;
    @Input() buttonCaption5: string;
    @Input() includeButton5: boolean;
    @Input() buttonCallback5: (Workshop) => void;
    imagePath: string;

    constructor() {
    }

    ngOnInit(): void {
        this.imagePath = imageUri + this.workshop.main_image;
    }

}
