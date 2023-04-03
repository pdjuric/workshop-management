import {Component, OnInit} from '@angular/core';
import {Workshop} from 'src/app/models/workshop';
import {AttendanceService} from "../../attendance.service";
import {getUser} from "../../utils";
import {WorkshopService} from "../../workshop.service";

@Component({
    selector: 'participant-workshops',
    templateUrl: './participant-workshops.component.html'
})
export class ParticipantWorkshopsComponent implements OnInit {

    user: any;
    // FUTURE ATTENDING WORKSHOP LIST
    futureWorkshops: Workshop[] = [];

    constructor(private attendanceService: AttendanceService, private workshopService: WorkshopService) {
    }

    get cancelAttendance() {
        return this._cancelAttendance.bind(this);
    }

    ngOnInit(): void {
        this.user = getUser();
        this.initFutureWorkshops();
        // this.fetchpending()
    }

    initFutureWorkshops() {
        this.attendanceService.getFutureByUser(this.user.username).subscribe((data: any[]) =>
            this.futureWorkshops = data.map(d => new Workshop(d))
        );
    }

    canBeCanceled(w: Workshop) {
        let d = new Date();
        d.setHours(d.getHours() + 12);
        return w.isAfter(d);
    }

    _cancelAttendance(w: Workshop) {
        this.attendanceService.cancel(this.user.username, w.idWorkshop).subscribe((response: any) => {
            if ('tooLate' in response) alert("It's too late to cancel!")
            this.initFutureWorkshops()
        });
    }

    //
    //
    // // PENDING WORKSHOPS
    //
    // get isOrganizer( ) {
    //   console.log(getUser()?.user_type)
    //   return getUser()?.user_type == 'organizer'
    // }
    // pendingWorkshops: Workshop[] = []
    //
    // fetchpending() {
    //   this.workshopService.pending().subscribe((data: any[]) => {
    //     let t: Workshop[] = [];
    //     for(let d of data) t.push(new Workshop(d));
    //     this.pendingWorkshops = t;
    //   })
    // }
    //
    // accept(w: Workshop) {
    //   this.workshopService.accept(w.idWorkshop).subscribe(data => {
    //     this.fetchpending();
    //   })
    // }
    //
    // reject(w: Workshop) {
    //   this.workshopService.reject(w.idWorkshop).subscribe(data => {
    //     this.fetchpending();
    //
    //   })
    // }

}
