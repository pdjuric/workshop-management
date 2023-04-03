import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {imageUri} from "../utils";

@Component({
    selector: 'conversation', templateUrl: './conversation.component.html', styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

    @Input() idConversation: number;
    @Input() name: string;
    @Input() image: string;

    @Output() conversationChosen = new EventEmitter<number>();
    conversation: any;

    constructor() {
        console.log("Conv " + this.idConversation)
    }

    get imagePath(): string {
        return imageUri + this.image;
    }

    onClick() {
        this.conversationChosen.emit(this.idConversation);
    }

    ngOnInit(): void {
    }


}
