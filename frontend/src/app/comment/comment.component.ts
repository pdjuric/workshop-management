import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Comment} from "../models/comment";
import {CommentService} from "../comment.service";

@Component({
    selector: 'comment', templateUrl: './comment.component.html', styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

    @Input() comment: Comment;
    @Output() deleted = new EventEmitter<number>();
    newText: string = "";
    editing = false;

    constructor(private commentService: CommentService) {
    }

    ngOnInit(): void {
        this.newText = this.comment.text;
    }

    discard() {
        this.editing = false;
        this.newText = this.comment.text;
    }

    delete() {
        this.commentService.delete(this.comment.idComment).subscribe((data) => {
            this.deleted.emit(null);
        });
    }

    save() {
        if (this.comment.text == this.newText) {
            this.editing = false;
            return;
        }
        this.commentService.save(this.comment.idComment, this.newText).subscribe((status) => {
            this.editing = false;
            this.comment.text = this.newText;
        });
    }

    onFocus(element: HTMLElement) {
        if (!this.editing) element.blur();
    }

}
