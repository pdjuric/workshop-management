import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {Field} from "./field";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'app-field-input', template: `

        <label class="col-12" [for]="field.id">{{ field.caption }}:</label>
        <div class="input-group">

            <div *ngIf="field.prependText" class="input-group-prepend">
                <div *ngIf="!field.prependClick" class="input-group-text child-field"
                     [innerHTML]="field.prependText"></div>
                <button *ngIf="field.prependClick" class="btn btn-outline-secondary"
                        (click)="field.prependClick($event)"
                        type="button" [innerHTML]="field.prependText"></button>
            </div>

            <input
                    *ngIf="field.children.length == 0"
                    style="height: 38px !important;"
                    class="form-control"

                    #element
                    [id]="field.id"
                    [type]="field.inputType"

                    [(ngModel)]="field.value"

                    [multiple]="field.multiple"
                    [accept]="field.accept"

                    (change)="field.onChange($event)"
                    (click)="field.click(element)"
                    (focus)="field.focus(element)"

                    [class.was-validated]="field.displayShadow && field.validated"
                    [class.is-invalid]="field.displayShadow && field.validated && field.invalid"
                    [class.is-valid]="field.displayShadow && field.validated && field.valid"
            >

        </div>
        <div
                [class.is-invalid]="field.validated && field.invalid"
                [class.is-valid]="field.validated && field.valid"></div>
        
        <div *ngIf="field.info" style="display: block;" class="my-0 form-text text-muted"> {{ field.info }} </div>

        <div *ngFor="let error of field.getErrors()" class=" my-0 invalid-feedback"> {{ error }} </div>

        <div *ngIf="field.inputType == 'file' && field.accept == 'image/*' && getImg != null">
            <button *ngIf="field.removable" (click)="field.removeImg($event)">remove</button>
            <img #preview class="col-12" id="preview" [src]="getImg">
        </div>
    `, styleUrls: ['./form.component.css']
})
export class FieldInputComponent implements OnInit {

    @Input() form: FormGroup;
    @Input() field: Field;

    constructor(private sanitizer: DomSanitizer) {
    }

    get getImg() {
        if (this.field.imgSrc == null) return null;
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.field.imgSrc)
    }

    ngOnInit(): void {
    }

}
