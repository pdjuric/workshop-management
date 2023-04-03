import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Message} from "../models/message";
import {MessageService} from "../message.service";
import {UserService} from "../user.service";


@Component({
    selector: 'app-chat', templateUrl: './chat.component.html', styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

    message_groups: { messages: any[], sentByParticipant: boolean, user: any }[];

    @Input() participant: any;
    @Input() myRole = 'participant';
    @ViewChild('messageList') messageList;
    @Input() invert = false;
    messages = [];
    currMessage: string = '';
    idConversation;
    @Input() organizer: any = null;
    handle = null
    last_data = null

    constructor(private messageService: MessageService, private userService: UserService) {
    }

    get conversationSet() {
        return this.message_groups != null;
    }

    ngOnDestroy(): void {
        clearInterval(this.handle)
    }

    ngOnInit(): void {
    }

    setConversation(idConversation: number, organizer: any, participant: any = null) {
        this.currMessage = '';
        this.idConversation = idConversation;

        this.userService.get_info(organizer).subscribe(user => {
            this.organizer = user;
            if (participant != null) {
                this.userService.get_info(participant).subscribe(user => {
                    this.participant = user;
                    this.fetchMessages();
                    this.handle = setInterval(this.fetchMessages.bind(this), 1000);
                })
            } else {
                this.fetchMessages();
                this.handle = setInterval(this.fetchMessages.bind(this), 1000);

            }


        })
    }

    fetchMessages() {
        this.messageService.fetchMessages(this.idConversation).subscribe((data: any[]) => {
            if (this.last_data == JSON.stringify(data)) return;
            this.last_data = JSON.stringify(data);
            let messages = []

            console.log(data)
            data.forEach(m => messages.push(new Message(m)));
            this.message_groups = [];
            let oldMessageGroup = [];
            for (let m of messages) if (oldMessageGroup.length == 0 || oldMessageGroup[0].sentByParticipant == m.sentByParticipant) {
                oldMessageGroup.push(m)
            } else {
                if (oldMessageGroup.length > 0) this.message_groups.push({
                    messages: oldMessageGroup,
                    sentByParticipant: oldMessageGroup[0].sentByParticipant,
                    user: oldMessageGroup[0].sentByParticipant ? this.participant : this.organizer
                })
                oldMessageGroup = [m]
            }

            if (oldMessageGroup?.length > 0) this.message_groups.push({
                messages: oldMessageGroup,
                sentByParticipant: oldMessageGroup[0].sentByParticipant,
                user: oldMessageGroup[0].sentByParticipant ? this.participant : this.organizer
            })

        })
    }

    sendMessage() {
        console.log(this.currMessage)
        if (this.currMessage == '') return;
        this.messageService.sendMessage(this.idConversation, this.myRole == 'participant', this.currMessage).subscribe(data => {
            this.currMessage = '';
        });
    }


}
