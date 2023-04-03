import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../user.service";
import {FormComponent} from "../form/form.component";
import {Field} from "../form/field";
import {email, imageDimensions, required} from "../form/validators";
import {Button} from "../form/button";

@Component({
    selector: 'edit-user', template: `
        <h1> User info </h1>

        <app-form
                #form
                [fieldsToInclude]="formFields"
                [buttons]="formButtons"
                formClasses="col-lg-4 col-md-6 offset-md-3 offset-lg-4 col-12">
        </app-form>

        <div
                *ngFor="let message of messages"
                class="alert alert-danger">
            {{message}}
        </div>
    `
})
export class EditUserComponent implements OnInit {
    messages: string[];
    @ViewChild('form') form: FormComponent;
    username: string;
    formFields: Field[] = [new Field({
        caption: 'First name', inputType: 'text', id: 'first_name', validators: [required]
    }), new Field({
        caption: 'Last name', inputType: 'text', id: 'last_name', validators: [required]
    }), new Field({
        caption: 'Username', inputType: 'text', id: 'username', validators: [required]
    }), new Field({
        caption: 'Telephone number', inputType: 'tel', id: 'telephone', validators: [required]
    }), new Field({
        caption: 'E-mail',
        inputType: 'email',
        id: 'email',
        errors: {email: 'Email is in the wrong format.'},
        validators: [required, email]
    }), new Field({
        caption: 'Profile image', inputType: 'file', accept: "image/*", id: 'img', errors: {
            dimensions: "Image dimensions must be between 100px and 300px"
        }, validators: [imageDimensions]
    }), new Field({
        caption: "Organization",
        inputType: 'switch',
        id: "isOrganizer",
        change: e => this.formFields.forEach(field => field.conditionChanged('isOrganizer'))
    }), new Field({
        caption: "Organization name", inputType: "text", id: "org_name", showCondition: 'isOrganizer', show: false
    }), new Field({
        caption: "Organization address", showCondition: 'isOrganizer', show: false, children: [new Field({
            prependText: "Country", inputType: "text", id: "org_country"
        }), new Field({
            prependText: "City", inputType: "text", id: "org_city"
        }), new Field({
            prependText: "Street", inputType: "text", id: "org_street"
        }), new Field({
            prependText: "Number", inputType: "text", id: "org_number"
        })]
    }), new Field({
        caption: "Organization registration number",
        inputType: "number",
        id: "org_rn",
        showCondition: 'isOrganizer',
        show: false
    }),]
    formButtons: Button[] = [new Button({
        click: () => this.router.navigate(['']), caption: "Cancel", classes: "col-6"
    }), new Button({
        click: this.submit.bind(this), caption: "Submit", classes: "col-6"
    })]

    constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private router: Router) {
        this.activatedRoute.params.subscribe(parameter => {
            this.userService.get_info(parameter.username).subscribe(user => {
                if (user == null) {
                    this.router.navigate([''])
                } else {
                    this.username = user['username'];
                    for (let field of this.formFields) if (field.inputType != 'file') {
                        if (field.id in user) field.value = user[field.id]
                        for (let child of field.children) if (child.id in user) child.value = user[child.id]
                    }
                    if (user['isOrganizer'] == true) this.formFields.forEach(field => field.conditionChanged('isOrganizer'))

                }
            })
        })
    }

    ngOnInit(): void {
    }

    async submit() {
        await this.form.validate();
        if (this.form.invalid) return;

        let data = this.form.getData();
        console.log(data)
        this.userService.update(this.username, data).subscribe((resp) => {
            this.messages = [];

            if ('duplicateUsername' in resp) this.form.fields.username.setError('taken');
            if ('duplicateEmail' in resp) this.form.fields.email.setError('taken');
            if (this.form.invalid) return;

            let img_data = this.form.getFormData({include: ['img', 'username']});
            if (!img_data.has('img')) {
                alert("User info updated!");
                this.router.navigate(['']);
                return;
            }

            this.form.fields.img.files = null;
            this.userService.upload_photo(img_data).subscribe((img_res: any) => {
                alert("User info updated!");
                this.router.navigate(['']);
            })
        })
    }

}
