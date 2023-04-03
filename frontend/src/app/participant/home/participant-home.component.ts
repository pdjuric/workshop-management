import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Workshop} from "../../models/workshop";
import {WorkshopService} from "../../workshop.service";
import {LikeService} from "../../like.service";
import {AttendanceService} from "../../attendance.service";
import {getUser} from "../../utils";
import {CommentService} from "../../comment.service";
import {MessageService} from "../../message.service";
import {ChatComponent} from "../../chat/chat.component";


@Component({
    selector: 'participant-home',
    templateUrl: './participant-home.component.html'
})
export class ParticipantHomeComponent implements OnInit {


    @ViewChild('chat') chat: ChatComponent;

    user: any;
    workshopsAttended: Workshop[] = [];
    sortCriteria = [
        {column: 'Workshop name', field: 'name'},
        {column: 'Time', field: 'dateTime'},
        {column: 'Place', field: 'place'}
    ]

    // ATTENDED WORKSHOP LIST
    likedWorkshops: Workshop[] = [];
    comments: { workshop: Workshop, comments: any[] }[] = [];
    conversations: any[] = [];

    constructor(private router: Router,
                private workshopService: WorkshopService,
                private likeService: LikeService,
                private attendanceService: AttendanceService,
                private commentService: CommentService,
                private messageService: MessageService,
                private activatedRoute: ActivatedRoute) {
    }

    // LIKED WORKSHOPS LIST

    get revokeLike() {
        return this._revokeLike.bind(this);
    }

    ngOnInit(): void {
        this.user = getUser();
        this.fetchAttendedWorkshops();
        this.fetchLikedWorkshops();
        this.fetchComments();
        this.fetchConversations();
    }

    fetchAttendedWorkshops() {
        this.attendanceService.getPastByUser(this.user.username).subscribe((data: any[]) =>
            this.workshopsAttended = data.map(d => new Workshop(d))
        );
    }

    sortAttendedWorkshops(field: string, ascending: boolean) {
        this.workshopsAttended.sort((a, b) => {
            let res

            if (field == "dateTime") res = a.isBefore(b) ? 1 : -1;
            else res = b[field].localeCompare(a[field]);

            return res * (ascending ? 1 : -1)
        })
    }

    // COMMENTS LIST

    fetchLikedWorkshops() {
        this.likeService.getByUser(this.user.username).subscribe((data: any[]) => this.likedWorkshops = data.map(d => new Workshop(d)));
    }

    _revokeLike(w: Workshop) {
        this.likeService.revoke(this.user.username, w.idWorkshop).subscribe(res => this.fetchLikedWorkshops());
    }

    // CONVERSATIONS

    fetchComments() {
        this.commentService.getByUser(this.user.username).subscribe((data: { workshop: Workshop, comments: Comment[] }[]) => {
            this.comments = data;
        });

    }

    fetchConversations() {
        this.messageService.fetchConversations(getUser().username).subscribe((data: any[]) => {
            this.conversations = data;
        })
    }

}
