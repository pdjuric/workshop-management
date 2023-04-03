import {Component, OnInit} from '@angular/core';
import {getUser} from "../../utils";
import {MessageService} from "../../message.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-workshop-messages', templateUrl: './workshop-messages.component.html'
})
export class WorkshopMessagesComponent implements OnInit {

    user = null;
    idWorkshop = null;
    conversations: any[] = [];

    constructor(private messageService: MessageService, private activatedRoute: ActivatedRoute) {
        this.activatedRoute.params.subscribe(params => this.idWorkshop = params.idWorkshop)
        this.user = getUser();
        console.log(this.user)
    }

    // CONVERSATIONS

    ngOnInit(): void {
        this.fetchUsers();
    }

    fetchUsers() {
        this.messageService.fetchUsersThatMessagedByWorkshop(this.idWorkshop).subscribe((data: any[]) => {
            this.conversations = data;
        })
    }

}
