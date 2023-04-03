import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../user.service";
import {Field} from "../form/field";
import {Button} from "../form/button";
import {FormComponent} from "../form/form.component";
import {email, required} from "../form/validators";

@Component({
    selector: 'reset-password',
    template: `
        <h1> Reset password </h1>

        <app-form
                #form
                [fieldsToInclude]="formFields"
                [buttons]="formButtons"
                formClasses="col-lg-4 col-md-6 offset-md-3 offset-lg-4 col-12">
        </app-form>
    `
})
export class ResetPasswordComponent implements OnInit {

    @ViewChild('form') form: FormComponent;
    formFields: Field[] = [
        new Field({
            caption: 'E-mail',
            inputType: 'email',
            id: 'email',
            errors: {email: 'Email is in the wrong format.'},
            validators: [required, email]
        })
    ]
    formButtons = [
        new Button({
            click: this.resetPassword.bind(this),
            caption: "Reset password",
            classes: "col-12"
        })
    ]

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
    }

    resetPassword() {
        let email = this.form.fields.email.value;
        this.userService.resetPassword(email).subscribe(resp => {
            alert("If there is an account with the provided email, temporary password will be sent to email.")
        })
    }

}

