import config from "./../../config.json";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AttendanceService {

    constructor(private http: HttpClient) {
    }

    getPastByUser(username: string) {
        return this.http.get(`${config.backend_uri}/attendance/past?username=${username}`);
    }

    getFutureByUser(username: string) {
        return this.http.get(`${config.backend_uri}/attendance/future?username=${username}`);
    }

    cancel(username, idWorkshop: number) {
        return this.http.delete(`${config.backend_uri}/attendance?username=${username}&idWorkshop=${idWorkshop}`);
    }

    subscribe(idWorkshop: number, username: string) {
        let data = {
            username: username, idWorkshop: idWorkshop
        }
        return this.http.post(`${config.backend_uri}/attendance/subscribe`, data);
    }

    tryReserve(idWorkshop: number, username: string) {
        let data = {
            username: username, idWorkshop: idWorkshop
        }
        return this.http.post(`${config.backend_uri}/attendance`, data);
    }

    getRequests(idWorkshop: number) {
        return this.http.get(`${config.backend_uri}/attendance/requests?idWorkshop=${idWorkshop}`);
    }

    accept(idWorkshop: number, username: string) {
        return this.http.get(`${config.backend_uri}/attendance/accept?username=${username}&idWorkshop=${idWorkshop}`);
    }

    reject(idWorkshop: number, username: string) {
        console.log(username)
        return this.http.get(`${config.backend_uri}/attendance/reject?username=${username}&idWorkshop=${idWorkshop}`);
    }


}
