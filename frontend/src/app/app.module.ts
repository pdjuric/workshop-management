import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './guest/login.component';
import {RegistrationComponent} from './guest/registration.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {ResetPasswordComponent} from './guest/reset-password.component';
import {WorkshopFilteredListComponent} from './workshop/workshop-filtered-list.component';
import {TopWorkshopsComponent} from './workshop/top-workshops.component';
import {GuestHomeComponent} from './guest/guest-home.component';
import {ParticipantHomeComponent} from './participant/home/participant-home.component';
import {ParticipantWorkshopsComponent} from './participant/participant-workshops/participant-workshops.component';
import {WorkshopCardComponent} from './workshop/workshop-card.component';
import {EditProfileComponent} from './participant/edit-profile.component';
import {AutosizeModule} from "ngx-autosize";
import {NavbarComponent} from './navbar/navbar.component';
import {HomeComponent} from "./home.component";
import {FormComponent} from './form/form.component';
import {WorkshopDetailsComponent} from './workshop-details/workshop-details.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BecomeAnOrganizerComponent} from './participant/become-an-organizer.component';
import {MapComponent} from './map/map.component';
import {GoogleMapsModule} from "@angular/google-maps";
import {FieldSwitchComponent} from './form/field-switch.component';
import {FieldChildComponent} from './form/field-child.component';
import {ButtonComponent} from './form/button.component';
import {FieldInputComponent} from './form/field-input.component';
import {CommentComponent} from "./comment/comment.component";
import {MessageGroupComponent} from "./message-group/message-group.component";
import {ChatComponent} from "./chat/chat.component";
import {ConversationComponent} from "./conversation/conversation.component";
import {AdministratorHomeComponent} from './administrator/administrator.component';
import {AdminHomeComponent} from './administrator/home/home.component';
import {UserCardComponent} from "./administrator/home/user-card.component";
import {EditUserComponent} from './edit-user/edit-user.component';
import {WorkshopsComponent} from './administrator/workshops/workshops.component';
import {OrganizerHomeComponent} from "./organizer/home/organizer-home.component";
import {WorkshopMessagesComponent} from './organizer/workshop-messages/workshop-messages.component';
import {WorkshopEditComponent} from './workshop-edit/workshop-edit.component';
import {WorkshopApplicationsComponent} from './workshop-applications/workshop-applications.component';
import {NewWorkshopComponent} from './new-workshop/new-workshop.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {ContactOrganizerComponent} from './contact-organizer/contact-organizer.component';

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent, LoginComponent, RegistrationComponent, ResetPasswordComponent, WorkshopFilteredListComponent, TopWorkshopsComponent, GuestHomeComponent, ParticipantHomeComponent, ParticipantWorkshopsComponent, WorkshopCardComponent, EditProfileComponent, NavbarComponent, HomeComponent, FormComponent, WorkshopDetailsComponent, BecomeAnOrganizerComponent, MapComponent, FieldSwitchComponent, FieldChildComponent, ButtonComponent, FieldInputComponent, CommentComponent, MessageGroupComponent, ChatComponent, ConversationComponent, ChatComponent, HomeComponent, UserCardComponent, AdministratorHomeComponent, EditUserComponent, WorkshopsComponent, OrganizerHomeComponent, WorkshopMessagesComponent, WorkshopEditComponent, WorkshopApplicationsComponent, NewWorkshopComponent, ChangePasswordComponent, AdminHomeComponent, ContactOrganizerComponent],
    imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, HttpClientModule, AutosizeModule, NgbModule, GoogleMapsModule],
    providers: []
})
export class AppModule {
}
