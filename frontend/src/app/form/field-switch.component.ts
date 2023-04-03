import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {Field} from "./field";
import {FormGroup} from "@angular/forms";

@Component({
    selector: 'app-field-switch',
    template: `
        <div>
            <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    #element

                    [id]="field.id"
                    [(ngModel)]="field.value"
                    (change)="field.change($event)"
                    (focus)="field.focus(element)">
          
            <label class="form-check-label ms-3" [for]="field.id"> {{ field.caption }} </label>
        </div>
    `,
    styleUrls: ['./form.component.css']
})
export class FieldSwitchComponent implements OnInit {

    @Input() form: FormGroup;
    @Input() field: Field;
    @HostBinding('class') classes = 'form-check form-switch my-3';

    ngOnInit(): void {
    }

}
