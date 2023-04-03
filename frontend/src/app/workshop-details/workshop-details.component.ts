import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {WorkshopService} from "../workshop.service";
import {Workshop} from "../models/workshop";
import {getUser, imageUri} from "../utils";
import {LikeService} from "../like.service";
import {AttendanceService} from "../attendance.service";
import {DomSanitizer} from "@angular/platform-browser";
import {CommentService} from "../comment.service";
import {MessageService} from "../message.service";

@Component({
    selector: 'app-workshop-details',
    templateUrl: './workshop-details.component.html',
    styleUrls: ['./workshop-details.component.css']
})
export class WorkshopDetailsComponent implements OnInit {

    workshop: Workshop = new Workshop({});
    imagePath: string;
    username: string;
    alreadyLiked: boolean = false;
    attending: number | null = null;
    comments: any[] = null;
    currComment: string = '';
    mapsUri = null
    idWorkshop: number = -1;
    willBeNotified: Boolean = false;

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private workshopService: WorkshopService, private messageService: MessageService, private likeService: LikeService, private attendanceService: AttendanceService, private sanitizer: DomSanitizer, private commentService: CommentService) {
    }

    galleryImagePath(img: string) {
        return imageUri + img;
    }

    ngOnInit(): void {
        this.idWorkshop = this.activatedRoute.snapshot.params['idWorkshop'];
        this.username = getUser().username;
        this.workshopService.details(this.idWorkshop, this.username).subscribe((data: any) => {
            if (data == null) this.router.navigate(['/workshops'])
            this.workshop = new Workshop(data)
            this.alreadyLiked = data.alreadyLiked;
            this.attending = data.attendingConfirmed;
            this.imagePath = imageUri + this.workshop.main_image;
            this.willBeNotified = data.willBeNotified;
            this.mapsUri = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.google.com/maps/embed/v1/place?q=' + this.workshop.map + '&key=AIzaSyDzyrQaf31mN8I7iB1C0GIlQ4V0xdEKakw');
        })
        this.fetchComments();
    }

    like() {
        if (this.alreadyLiked) return;
        this.likeService.like(this.username, this.workshop.idWorkshop).subscribe(data => {
            this.workshop.like_count += 1;
            this.alreadyLiked = true;
        })
    }


    sendAttendanceRequest(workshop: Workshop) {
        this.attendanceService.tryReserve(workshop.idWorkshop, this.username).subscribe((resp: any) => {
            if ('beFasterNextTime' in resp) {
                alert('Someone took your place!');
                this.workshop.spots_left = 0;
            } else {
                alert('You successfully sent an attendance request!');
                this.attending = 0;
            }
        })

    }

    notifyWhenAvailable(workshop: Workshop) {
        this.attendanceService.subscribe(workshop.idWorkshop, this.username).subscribe(data => {
            this.willBeNotified = true;
        })
    }

    getUserImage(image: string) {
        return imageUri + image
    }

    getDate(dateTime: string) {
        return new Date(dateTime).toLocaleString()

    }

    fetchComments() {
        this.commentService.fetchForUserAndWorkshop(this.idWorkshop, this.username).subscribe((data: any[]) => {
            this.comments = data;
            console.log(data)
        })
    }


    addComment() {
        if (this.currComment == '') return;
        this.commentService.add(this.username, this.idWorkshop, this.currComment).subscribe(data => {
            this.currComment = '';
            this.fetchComments();
        });
    }

    chatWithOrganizer() {
        this.router.navigate(['contact-organizer', this.idWorkshop])
    }
}
