import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {Field} from "./field";

@Component({
    selector: 'app-field-child',
    template: `
        <div class="input-group">

            <div *ngIf="field.prependText" class="input-group-prepend col-3">
                <div *ngIf="!field.prependClick" class="input-group-text child-field w-100"
                     [innerHTML]="field.prependText"></div>
                <button *ngIf="field.prependClick" class="btn btn-outline-secondary w-100"
                        (click)="field.prependClick($event)" type="button" [innerHTML]="field.prependText"></button>
            </div>

            <input
                    class="form-control child-field col-auto"
                    #element
                    [id]="field.id"

                    [(ngModel)]="field.value"
                    [type]="field.inputType"

                    [multiple]="field.multiple"
                    [accept]="field.accept"

                    (change)="field.onChange($event)"
                    (focus)="field.focus(element)"

                    [class.is-invalid]="field.validated && field.invalid"
                    [class.is-valid]="field.validated && field.valid"
            >

            <div *ngFor="let err of field.getErrors()" class="invalid-feedback"> {{err}} </div>

        </div>
    `,
    styleUrls: ['./form.component.css']
})
export class FieldChildComponent implements OnInit {

    @Input() form: FormGroup;
    @Input() field: Field;
    @HostBinding('class') classes = 'input-group mb-1';

    ngOnInit(): void {
    }

}
