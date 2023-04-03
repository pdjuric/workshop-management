import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import config from "./../../config.json";

@Injectable({
    providedIn: 'root'
})
export class WorkshopService {
    constructor(private http: HttpClient) {
    }

    getActive() {
        return this.http.get(`${config.backend_uri}/workshop/active`);
    }

    getTop() {
        return this.http.get(`${config.backend_uri}/workshop/top`);
    }

    add(data: any) {
        return this.http.post(`${config.backend_uri}/workshop/add`, data);
    }

    uploadGallery(data: any) {
        return this.http.post(`${config.backend_uri}/workshop/upload-gallery`, data);
    }

    details(idWorkshop: number, username: string) {
        return this.http.get(`${config.backend_uri}/workshop/details?idWorkshop=${idWorkshop}&username=${username}`);
    }

    getByOrganizer(username: string) {
        return this.http.get(`${config.backend_uri}/workshop/organizer?username=${username}`);
    }

    getForEdit(idWorkshop: string) {
        return this.http.get(`${config.backend_uri}/workshop/edit?idWorkshop=${(idWorkshop)}`);
    }

    edit(idWorkshop: string, edited_data: any) {
        let data = {
            idWorkshop: idWorkshop, data: edited_data
        }
        return this.http.post(`${config.backend_uri}/workshop/edit`, data);
    }


    editGallery(idWorkshop, i: number, file) {
        let data = new FormData();
        data.append('img', file)
        return this.http.post(`${config.backend_uri}/workshop/edit-gallery?idWorkshop=${(idWorkshop)}&no=${i}`, data);
    }

    getTemplate(idWorkshop: number) {
        return this.http.get(`${config.backend_uri}/workshop/template?idWorkshop=${(idWorkshop)}`);
    }

    subscribe(idWorkshop: number, username: string) {
        let data = {
            username: username, idWorkshop: idWorkshop
        }
        return this.http.post(`${config.backend_uri}/workshop/subscribe`, data);
    }

    pending() {
        return this.http.get(`${config.backend_uri}/workshop/pending`);
    }

    accept(idWorkshop: number) {
        return this.http.get(`${config.backend_uri}/workshop/accept?idWorkshop=${idWorkshop}`);
    }

    reject(idWorkshop: number) {
        return this.http.get(`${config.backend_uri}/workshop/reject?idWorkshop=${idWorkshop}`);
    }

    cancel(idWorkshop: number) {
        return this.http.delete(`${config.backend_uri}/workshop?idWorkshop=${idWorkshop}`);

    }
}
