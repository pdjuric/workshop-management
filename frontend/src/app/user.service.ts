import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import config from "./../../config.json";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) {
    }

    register(data) {
        return this.http.post(`${config.backend_uri}/user/register`, data);
    }

    login(data) {
        return this.http.post(`${config.backend_uri}/user/login`, data);
    }

    resetPassword(email: string) {
        return this.http.post(`${config.backend_uri}/user/password-reset`, {email: email});
    }

    upload_photo(formData: FormData) {
        return this.http.post(`${config.backend_uri}/user/upload-profile`, formData);
    }

    editProfile(username: string, user_data: any) {
        let data = {
            username: username, new_data: user_data
        }
        return this.http.post(`${config.backend_uri}/user/edit-profile`, data)
    }

    getActive() {
        return this.http.get(`${config.backend_uri}/user/active`)
    }

    getPending() {
        return this.http.get(`${config.backend_uri}/user/pending`)
    }

    update_status(username: string, status: string) {
        return this.http.put(`${config.backend_uri}/user/status`, {username: username, status: status})
    }

    get_info(username: any) {
        return this.http.get(`${config.backend_uri}/user?username=${username}`)
    }

    update(username: string, user_data: any) {
        let data = {
            username: username, new_data: user_data
        }
        return this.http.post(`${config.backend_uri}/user/update`, data)
    }

    delete(username: any) {
        return this.http.delete(`${config.backend_uri}/user?username=${username}`)
    }

    changePassword(username: string, newPassword: string) {
        let data = {
            username: username, password: newPassword
        }
        return this.http.post(`${config.backend_uri}/user/change-password`, data)
    }
}
