import {Component, Input, OnInit} from '@angular/core';
import config from "./../../../config.json";
import {Message} from "../models/message";

@Component({
    selector: 'message-group',
    templateUrl: './message-group.component.html',
    styleUrls: ['./message-group.component.css']
})
export class MessageGroupComponent implements OnInit {

    @Input() user: any;
    @Input() messages: Message[];
    @Input() sentByParticipant: boolean;

    get imagePath(): string {
        return config.backend_uri + '/image/' + this.user.image;
    }

    ngOnInit(): void {
    }

}
