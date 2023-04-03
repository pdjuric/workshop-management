import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {getUser} from "../utils";
import {WorkshopService} from "../workshop.service";
import {MessageService} from "../message.service";
import {ChatComponent} from "../chat/chat.component";

@Component({
    selector: 'app-contact-organizer',
    template: `
        <app-chat #chat [participant]="user"></app-chat>`,
    styleUrls: ['./contact-organizer.component.css']
})
export class ContactOrganizerComponent implements OnInit {

    @ViewChild('chat') chat: ChatComponent;
    idConversation: number = -1;
    organizer: string = null;
    user: any = {}

    constructor(private activatedRoute: ActivatedRoute, private messageService: MessageService) {
    }

    ngOnInit(): void {
        this.user = getUser()
        let username = getUser().username;
        this.activatedRoute.params.subscribe(params => {
            this.messageService.getConversation(username, params.idWorkshop).subscribe((data: any) => {
                this.chat.setConversation(data.idConversation, data.organizer)
            })
        })

    }

}
