import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../user.service";
import {Router} from "@angular/router";
import {Button} from "../form/button";
import {FormComponent} from "../form/form.component";
import {Field} from "../form/field";
import {email, imageDimensions, passwordValidator, required} from "../form/validators";
import {getUser} from "../utils";

@Component({
    selector: 'registration',
    template: `
        <h1> Register </h1>

        <app-form
                #form
                [fieldsToInclude]="formFields"
                [buttons]="formButtons"
                formClasses="col-lg-4 col-md-6 offset-md-3 offset-lg-4 col-12">
        </app-form>
    `
})
export class RegistrationComponent implements OnInit {

    @ViewChild('form') formComponent: FormComponent;
    formFields: Field[] = [
        new Field({
            caption: 'First name',
            inputType: 'text',
            id: 'first_name',
            validators: [required]
        }),
        new Field({
            caption: 'Last name',
            inputType: 'text',
            id: 'last_name',
            validators: [required]
        }),
        new Field({
            caption: 'Username',
            inputType: 'text',
            id: 'username',
            errors: {taken: "This username is already taken."},
            validators: [required]
        }),
        new Field({
            caption: 'Password',
            inputType: 'password',
            id: 'password',
            errors: {
                letterStart: "Password must start with a letter.",
                uppercase: "Password must contain at least one uppercase letter.",
                special: "Password must contain at least one special character.",
                length: "Password must be between 8 and 16 characters long.",
                number: "Password must contain at least one numeric."
            },
            validators: [required, passwordValidator]
        }),
        new Field({
            caption: 'Confirm password',
            inputType: 'password',
            id: 'confirm_password',
            errors: {passwordMismatch: "Passwords do not match."},
            validators: [required, this.passwordConfirmationValidator.bind(this)]
        }),
        new Field({
            caption: 'Telephone number',
            inputType: 'tel',
            id: 'telephone',
            validators: [required]
        }),
        new Field({
            caption: 'E-mail',
            inputType: 'email',
            id: 'email',
            errors: {email: 'Email is in the wrong format.', taken: "This email is already taken."},
            validators: [required, email]
        }),
        new Field({
            caption: 'Profile image',
            inputType: 'file',
            accept: "image/*",
            id: 'img',
            errors: {
                dimensions: "Image dimensions must be between 100px and 300px"
            },
            validators: [required, imageDimensions]
        }),
        new Field({
            caption: "Organization",
            inputType: 'switch',
            id: "isOrganizer",
            change: e => this.formFields.forEach(field => field.conditionChanged('isOrganizer'))
        }),
        new Field({
            caption: "Organization name",
            inputType: "text",
            id: "org_name",
            showCondition: 'isOrganizer',
            show: false
        }),
        new Field({
            caption: "Organization address",
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
            showCondition: 'isOrganizer',
            show: false
        }),
    ]
    formButtons = [
        new Button({
            click: this.register.bind(this),
            caption: "Register",
            classes: "col-12"
        })
    ]

    constructor(private userService: UserService, private router: Router) {
    }

    ngOnInit(): void {
    }

    async register() {

        await this.formComponent.validate();
        if (this.formComponent.invalid) return;

        let data = this.formComponent.getData(['confirm_password', 'img']);
        data['byAdmin'] = (getUser()?.user_type == 'admin') ?? false;
        console.log(data['byAdmin'])
        this.userService.register(data).subscribe(resp => {
            if ('duplicateUsername' in resp) this.formComponent.fields.username.setError('taken');
            if ('duplicateEmail' in resp) this.formComponent.fields.email.setError('taken');
            if (this.formComponent.invalid) return;

            data = this.formComponent.getFormData({include: ['username', 'img']});

            this.userService.upload_photo(data).subscribe(resp => {
                alert("Registration successful!");
                this.router.navigate(['']);
            })
        })
    }


    passwordConfirmationValidator(confirm_password: any) {
        if (!this.formComponent?.fields) return null;
        let password = this.formComponent.fields.password.value;
        return (password != confirm_password) ? ['passwordMismatch'] : null;
    }


}
