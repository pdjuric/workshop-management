import {Component, OnInit} from '@angular/core';
import {WorkshopService} from "../workshop.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Workshop} from "../models/workshop";
import {getUser} from "../utils";
import {AttendanceService} from "../attendance.service";

@Component({
    selector: 'app-workshop-applications',
    template: `
        <h1> Requests ({{spots}} spot{{spots != 1 ? 's' : ''}} left)</h1>


        <h2 class="text-stroke text-opacity-50 text-black" *ngIf="usernames.length == 0">No pending requests.</h2>

        <br>
        <table class="table">
            <tbody>

            <tr *ngFor="let u of usernames">
                <td class="col-4 col-md-6"><h5>{{u}}</h5></td>

                <td class="col-4 col-md-3">
                    <button class="btn btn-light offset-3 col-6" (click)="accept(u)"> Accept</button>
                </td>
                <td class="col-4 col-md-3">
                    <button class="btn btn-light offset-3 col-6" (click)="reject(u)"> Reject</button>
                </td>

            </tr>

            </tbody>
        </table>

    `
})
export class WorkshopApplicationsComponent implements OnInit {


    usernames: string[] = []
    idWorkshop;
    spots: number = 0;

    constructor(private workshopService: WorkshopService, private activatedRoute: ActivatedRoute, private router: Router, private attendanceService: AttendanceService) {
        this.activatedRoute.params.subscribe(params => {
            this.idWorkshop = params.idWorkshop
            this.workshopService.getForEdit(params.idWorkshop).subscribe(data => {

                let wdata = new Workshop(data)
                if (wdata.organizer != getUser().username) this.router.navigate(['']);

            })
        })
    }

    ngOnInit(): void {
        this.fetch();
    }

    fetch() {
        this.attendanceService.getRequests(this.idWorkshop).subscribe((data: any[]) => {
            this.usernames = data['users'];
        })

        this.workshopService.getForEdit(this.idWorkshop).subscribe((data: any[]) => {
            console.log(data)
            this.spots = data['spots_left'];
        })
    }

    accept(username: string) {
        if (this.spots <= 0) return;
        this.attendanceService.accept(this.idWorkshop, username).subscribe(t => {
            this.fetch();
        })
    }

    reject(username: string) {
        this.attendanceService.reject(this.idWorkshop, username).subscribe(t => {
            this.fetch();
        })
    }
}
