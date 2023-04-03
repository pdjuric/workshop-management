import {Injectable, NgModule} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterModule, RouterStateSnapshot, Routes} from '@angular/router';
import {LoginComponent} from "./guest/login.component";
import {RegistrationComponent} from "./guest/registration.component";
import {ResetPasswordComponent} from "./guest/reset-password.component";
import {HomeComponent} from "./home.component";
import {ParticipantWorkshopsComponent} from "./participant/participant-workshops/participant-workshops.component";
import {WorkshopDetailsComponent} from "./workshop-details/workshop-details.component";
import {BecomeAnOrganizerComponent} from "./participant/become-an-organizer.component";
import {getUser} from "./utils";
import {EditUserComponent} from "./edit-user/edit-user.component";
import {WorkshopMessagesComponent} from "./organizer/workshop-messages/workshop-messages.component";
import {WorkshopEditComponent} from "./workshop-edit/workshop-edit.component";
import {WorkshopApplicationsComponent} from "./workshop-applications/workshop-applications.component";
import {NewWorkshopComponent} from "./new-workshop/new-workshop.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {ContactOrganizerComponent} from "./contact-organizer/contact-organizer.component";


@Injectable()
export class RoleGuard implements CanActivate {

    constructor(private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let user = getUser();
        let role = route.data.role;
        if (role == 'guest' && user == null || role == user?.user_type || role == 'both' && (user?.user_type == 'participant' || user?.user_type == 'organizer') || role == 'registered' && user != null || role == 'guest|admin' && (user == null || user?.user_type == 'admin') || role == 'organizer|admin' && (user?.user_type == 'organizer' || user?.user_type == 'admin')) {
            return true;
        } else return this.router.parseUrl('');
    }
}

const routes: Routes = [{path: '', component: HomeComponent}, {
    path: 'login',
    component: LoginComponent,
    canActivate: [RoleGuard],
    data: {role: 'guest'}
}, {
    path: 'admin-login',
    component: LoginComponent,
    canActivate: [RoleGuard],
    data: {role: 'guest', admin: true}
}, {
    path: 'register',
    component: RegistrationComponent,
    canActivate: [RoleGuard],
    data: {role: 'guest|admin'}
}, {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [RoleGuard],
    data: {role: 'guest'}
}, {
    path: 'workshops',
    component: ParticipantWorkshopsComponent,
    canActivate: [RoleGuard],
    data: {role: 'both'}
}, {
    path: 'workshop-details/:idWorkshop',
    component: WorkshopDetailsComponent,
    canActivate: [RoleGuard],
    data: {role: 'both'}
}, {path: 'become-an-organizer', component: BecomeAnOrganizerComponent}, {
    path: 'edit-user/:username',
    component: EditUserComponent,
    canActivate: [RoleGuard],
    data: {role: 'admin'}
}, {
    path: 'workshop-messages/:idWorkshop',
    component: WorkshopMessagesComponent,
    canActivate: [RoleGuard],
    data: {role: 'organizer'}
}, {
    path: 'workshop-edit/:idWorkshop',
    component: WorkshopEditComponent,
    canActivate: [RoleGuard],
    data: {role: 'organizer|admin'}
}, {
    path: 'workshop-applications/:idWorkshop',
    component: WorkshopApplicationsComponent,
    canActivate: [RoleGuard],
    data: {role: 'organizer|admin'}
}, {
    path: 'workshop-new',
    component: NewWorkshopComponent,
    canActivate: [RoleGuard],
    data: {role: 'organizer|admin'}
}, {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [RoleGuard],
    data: {role: 'registered'}
}, {
    path: 'contact-organizer/:idWorkshop',
    component: ContactOrganizerComponent,
    canActivate: [RoleGuard],
    data: {role: 'participant'}
},

    // { path: '**', redirectTo:'' }
]


@NgModule({
    imports: [RouterModule.forRoot(routes)], exports: [RouterModule], providers: [RoleGuard]
})
export class AppRoutingModule {
}
