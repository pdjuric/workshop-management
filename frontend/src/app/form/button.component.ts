import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {Button} from "./button";

@Component({
    selector: 'app-button',
    template: `
        <button
                (click)="button.click()"
                class="w-100 btn btn-outline-primary my-3">
            {{button.caption}}
        </button>
    `,
    styleUrls: ['./form.component.css']
})
export class ButtonComponent implements OnInit {

    @Input() button: Button;
    @HostBinding('class') classes;

    ngOnInit(): void {
        this.classes = this.button.classes;
    }

}
