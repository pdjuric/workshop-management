import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {UserService} from "../user.service";
import {Field} from "../form/field";
import {Button} from "../form/button";
import {FormComponent} from "../form/form.component";
import {email, imageDimensions, required} from "../form/validators";

@Component({
    selector: 'edit-profile',
    template: `
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
export class EditProfileComponent implements OnInit {

    @Input() user: any;
    @Output() userChange = new EventEmitter<any>();
    @ViewChild('form') form: FormComponent;
    formFields: Field[] = [
        new Field({
            caption: 'First name',
            inputType: 'text',
            id: 'first_name',
            editCondition: 'editing',
            edit: false,
            validators: [required]
        }),
        new Field({
            caption: 'Last name',
            inputType: 'text',
            id: 'last_name',
            editCondition: 'editing',
            edit: false,
            validators: [required]
        }),
        new Field({
            caption: 'Username',
            inputType: 'text',
            id: 'username',
            editCondition: 'editing',
            edit: false,
            validators: [required]
        }),
        new Field({
            caption: 'Telephone number',
            inputType: 'tel',
            id: 'telephone',
            editCondition: 'editing',
            edit: false,
            validators: [required]
        }),
        new Field({
            caption: 'E-mail',
            inputType: 'email',
            id: 'email',
            editCondition: 'editing',
            edit: false,
            errors: {email: 'Email is in the wrong format.'},
            validators: [required, email]
        }),
        new Field({
            caption: 'Profile image',
            inputType: 'file',
            accept: "image/*",
            id: 'img',
            showCondition: 'editing',
            show: false,
            errors: {
                dimensions: "Image dimensions must be between 100px and 300px"
            },
            validators: [imageDimensions]
        }),
        new Field({
            caption: "Organization name",
            inputType: "text",
            id: "org_name",
            editCondition: 'editing',
            edit: false,
            showCondition: 'isOrganizer',
            show: false
        }),
        new Field({
            caption: "Organization address",
            editCondition: 'editing',
            edit: false,
            showCondition: 'isOrganizer',
            show: false,
            children: [
                new Field({
                    prependText: "Country",
                    inputType: "text",
                    id: "org_country"
                }),
                new Field({
                    prependText: "City",
                    inputType: "text",
                    id: "org_city"
                }),
                new Field({
                    prependText: "Street",
                    inputType: "text",
                    id: "org_street"
                }),
                new Field({
                    prependText: "Number",
                    inputType: "text",
                    id: "org_number"
                })
            ]
        }),
        new Field({
            caption: "Organization registration number",
            inputType: "number",
            id: "org_rn",
            editCondition: 'editing',
            edit: false,
            showCondition: 'isOrganizer',
            show: false
        }),
    ]
    formButtons: Button[] = [
        new Button({
            click: this.toggleEditing.bind(this),
            caption: "Edit profile",
            classes: "col-6",
            showCondition: 'editing'
        }),
        new Button({
            click: this.cancel.bind(this),
            caption: "Cancel",
            classes: "col-6",
            showCondition: 'editing',
            show: false
        }),
        new Button({
            click: this.editProfile.bind(this),
            caption: "Submit",
            classes: "col-6",
            showCondition: 'editing',
            show: false
        })
    ]
    messages = [];
    editing: boolean = false;

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.initProfileInfo();
        if (this.user.user_type == 'organizer')
            this.formFields.forEach(field => field.conditionChanged('isOrganizer'))
    }

    initProfileInfo() {
        for (let field of this.formFields)
            if (field.inputType != 'file') {
                if (field.id in this.user) field.value = this.user[field.id]
                for (let child of field.children)
                    if (child.id in this.user) child.value = this.user[child.id]
            }
    }

    toggleEditing() {
        this.editing = false;
        this.form.fieldsToInclude.forEach(field => field.validated = false)
        this.form.fields.img.reset();
        this.formFields.forEach(field => field.conditionChanged('editing'))
        this.formButtons.forEach(btn => btn.conditionChanged('editing'))
    }

    cancel() {
        this.toggleEditing();
        this.initProfileInfo();
    }

    save(user_data, img = null) {
        if (user_data != null)
            for (let key in user_data)
                this.user[key] = user_data[key];

        if (img != null)
            this.user.image = img;

        this.toggleEditing();
        sessionStorage.setItem('user', JSON.stringify(this.user));
        this.userChange.emit(this.user);
        alert("Profile updated!");
    }

    async editProfile() {
        await this.form.validate();
        if (this.form.invalid) return;

        let data = this.form.getData();

        this.userService.editProfile(this.user.username, data).subscribe((resp) => {
            this.messages = [];

            if ('duplicateUsername' in resp) this.form.fields.username.setError('taken');
            if ('duplicateEmail' in resp) this.form.fields.email.setError('taken');
            if (this.form.invalid) return;

            let img_data = this.form.getFormData({include: ['img', 'username']});
            if (!img_data.has('img')) {
                this.save(data)
                return;
            }

            this.form.fields.img.files = null;
            this.userService.upload_photo(img_data).subscribe((img_res: any) => {
                this.save(data, img_res.img);
            })
        })
    }

}
