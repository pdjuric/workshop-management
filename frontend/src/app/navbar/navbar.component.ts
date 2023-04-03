import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {getUser} from "../utils";

@Component({
    selector: 'nav-bar',
    templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

    guest = [
        {
            caption: 'Login',
            routerLink: '/login'
        },
        {
            caption: 'Register',
            routerLink: '/register'
        },
        {
            caption: 'Reset password',
            routerLink: '/reset-password'
        }
    ]
    participant = [
        {
            caption: 'Workshops',
            routerLink: '/workshops'
        },
        {
            caption: 'Become an organizer',
            routerLink: '/become-an-organizer'
        },
        {
            caption: 'Change password',
            routerLink: '/change-password'
        },
        {
            caption: 'Logout',
            routerLink: '/',
            click: () => {
                sessionStorage.clear();
                this.router.navigate([''])
            }
        }
    ]
    organizer = [
        {
            caption: 'Workshops',
            routerLink: '/workshops'
        },
        {
            caption: 'New Workshop',
            routerLink: '/workshop-new'
        },
        {
            caption: 'Change password',
            routerLink: '/change-password'
        },
        {
            caption: 'Logout',
            routerLink: '/',
            click: () => {
                sessionStorage.clear();
                this.router.navigate([''])
            }
        }
    ]
    admin = [
        {
            caption: 'New Workshop',
            routerLink: '/workshop-new'
        },
        {
            caption: 'Register a user',
            routerLink: '/register'
        },
        {
            caption: 'Change password',
            routerLink: '/change-password'
        },
        {
            caption: 'Logout',
            routerLink: '/',
            click: () => {
                sessionStorage.clear();
                this.router.navigate([''])
            }
        }
    ]

    constructor(private router: Router) {
    }

    get items() {
        return this[getUser()?.user_type ?? 'guest'];
    }

    ngOnInit(): void {
    }

    onClick(item) {
        if ('click' in item) item.click();
    }

}
