import config from "./../../config.json";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class LikeService {

    constructor(private http: HttpClient) {
    }

    getByUser(username: string) {
        return this.http.get(`${config.backend_uri}/like?username=${username}`);
    }

    revoke(username: string, idWorkshop: number) {
        return this.http.delete(`${config.backend_uri}/like?username=${username}&idWorkshop=${idWorkshop}`);
    }

    like(username: string, idWorkshop: number) {
        let data = {
            username: username, idWorkshop: idWorkshop
        }
        return this.http.post(`${config.backend_uri}/like`, data);
    }

}
