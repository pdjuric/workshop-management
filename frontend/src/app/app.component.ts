import {Component} from '@angular/core';

@Component({
    selector: 'app-root', template: `
        <div style=" min-height: 100%; height: auto !important; height: 100%; margin: 0 auto -50px; background: #fff !important;">
            <nav-bar></nav-bar>
            <div class="container" style="">
                <router-outlet></router-outlet>
            </div>
            <div style="height: 50px;"></div>
        </div>
        <footer class="rounded" style="height: 50px; background: #fafafa;">
            <div class="d-flex justify-content-center">
                <p>developed by Pavle Djuric 2019/0153</p>
            </div>
        </footer>
    `
})
export class AppComponent {
}
