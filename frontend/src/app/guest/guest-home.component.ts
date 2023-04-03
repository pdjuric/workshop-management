import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'guest-home',
    template: `
        <h1>Upcoming workshops</h1>
        <workshop-filtered-list></workshop-filtered-list>
        <top-workshops></top-workshops>
    `
})
export class GuestHomeComponent implements OnInit {

    ngOnInit(): void {
    }

}
