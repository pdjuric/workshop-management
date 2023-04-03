import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Field} from "../form/field";
import {Button} from "../form/button";
import {FormComponent} from "../form/form.component";
import {required} from "../form/validators";

@Component({
    selector: 'login',
    template: `
        <h1> {{admin ? 'Administrator ' : ''}}Login </h1>

        <app-form
                #form
                [fieldsToInclude]="formFields"
                [buttons]="formButtons"
                formClasses="col-lg-4 col-md-6 offset-md-3 offset-lg-4 col-12">
        </app-form>

        <div
                *ngIf="message"
                class="alert alert-danger col-lg-4 col-md-6 offset-md-3 offset-lg-4 col-12">
            {{message}}
        </div>
    `
})
export class LoginComponent implements OnInit {

    @ViewChild('form') form: FormComponent;

    admin = false;
    formFields: Field[] = [
        new Field({
            caption: 'Username',
            inputType: 'text',
            id: 'username',
            validators: [required]
        }),
        new Field({
            caption: 'Password',
            inputType: 'password',
            id: 'password',
            validators: [required]
        })
    ]
    formButtons = [
        new Button({
            click: this.login.bind(this),
            caption: "Login",
            classes: "col-12"
        })
    ]
    message: string = '';

    constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) {
        this.activatedRoute.data.subscribe(data => {
            if (data.admin) this.admin = true
        })
    }

    ngOnInit(): void {
    }

    async login() {
        this.message = '';
        await this.form.validate();
        if (this.form.invalid) return;

        let login_data = this.form.getData();
        login_data.admin = this.admin;

        this.userService.login(login_data).subscribe((data: any) => {
            if (data.pending == true) this.message = "User registration is not accepted yet.";
            else if (data.declined == true) this.message = "Your registration has been declined by the administrator.";
            else if (data.user == null) this.message = "Wrong credentials";
            else {
                sessionStorage.setItem('user', JSON.stringify(data.user));
                this.router.navigate([''])
            }
        })
    }

}

