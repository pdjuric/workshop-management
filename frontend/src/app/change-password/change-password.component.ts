import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../user.service";
import {Field} from "../form/field";
import {Button} from "../form/button";
import {FormComponent} from "../form/form.component";
import {oldPassword, passwordValidator, required} from "../form/validators";
import {getUser} from "../utils";
import {Router} from "@angular/router";

@Component({
    selector: 'app-change-password', template: `
        <h1> Change password </h1>

        <app-form
                #form
                [fieldsToInclude]="formFields"
                [buttons]="formButtons"
                formClasses="col-lg-4 col-md-6 offset-md-3 offset-lg-4 col-12">
        </app-form>
    `
})
export class ChangePasswordComponent implements OnInit {

    @ViewChild('form') form: FormComponent;
    formFields: Field[] = [new Field({
        caption: 'Old password', inputType: 'password', id: 'old_password', errors: {
            required: 'Old password is required.', oldPassword: 'The entered password is not correct'
        }, validators: [required, oldPassword]
    }), new Field({
        caption: 'New password', inputType: 'password', id: 'password', errors: {
            required: 'New password is required.',
            letterStart: "Password must start with a letter.",
            uppercase: "Password must contain at least one uppercase letter.",
            special: "Password must contain at least one special character.",
            length: "Password must be between 8 and 16 characters long.",
            number: "Password must contain at least one numeric."
        }, validators: [required, passwordValidator]
    }), new Field({
        caption: 'Confirm new password', inputType: 'password', id: 'confirm', errors: {
            required: 'Password confirmation is required.', passwordMismatch: "Passwords do not match."
        }, validators: [required, this.passwordConfirmationValidator.bind(this)]
    })]
    formButtons = [new Button({
        click: this.resetPassword.bind(this), caption: "Reset password", classes: "col-12"
    })]

    constructor(private userService: UserService, private router: Router) {
    }

    ngOnInit(): void {
    }

    passwordConfirmationValidator(confirm_password: any) {
        if (!this.form?.fields) return null;
        let password = this.form.fields.password.value;
        return (password != confirm_password) ? ['passwordMismatch'] : null;
    }

    async resetPassword() {
        await this.form.validate()
        if (this.form.invalid) return;

        let username = getUser().username
        let newPassword = this.form.fields.password.value

        this.userService.changePassword(username, newPassword).subscribe(data => {
            alert('Password is changed. You will be logged out');
            sessionStorage.clear();
            this.router.navigate(['/login'])
        })

    }

}



