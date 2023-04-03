import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import config from "./../../config.json";

@Injectable({
    providedIn: 'root'
})
export class CommentService {

    constructor(private http: HttpClient) {
    }

    getByUser(username: string) {
        return this.http.get(`${config.backend_uri}/comment?username=${username}`);
    }

    delete(idComment: number) {
        return this.http.delete(`${config.backend_uri}/comment?idComment=${idComment}`)
    }

    save(idComment: number, newText: string) {
        let data = {
            idComment: idComment, text: newText
        }
        return this.http.put(`${config.backend_uri}/comment`, data)
    }

    add(username: string, idWorkshop: number, text: string) {
        let data = {
            username: username, idWorkshop: idWorkshop, text: text
        }
        return this.http.post(`${config.backend_uri}/comment`, data)
    }

    fetchForUserAndWorkshop(idWorkshop: number, username: string) {
        return this.http.get(`${config.backend_uri}/comment?idWorkshop=${idWorkshop}&username=${username}`);
    }
}
