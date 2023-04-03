import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import config from "./../../config.json";

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    constructor(private http: HttpClient) {
    }

    fetchConversations(username: string) {
        return this.http.get(config.backend_uri + `/message/conversations?username=${username}`);
    }

    fetchUsersThatMessagedByWorkshop(idWorkshop: number) {
        return this.http.get(config.backend_uri + `/message/users?idWorkshop=${idWorkshop}`);
    }

    fetchMessages(idConversation: number) {
        return this.http.get(config.backend_uri + `/message?idConversation=${idConversation}`);
    }

    sendMessage(idConversation, sentByParticipant: boolean, currMessage: string) {
        let data = {
            idConversation: idConversation, sentByParticipant: sentByParticipant, message: currMessage
        }
        return this.http.post(config.backend_uri + '/message', data);
    }

    getConversation(participant: string, idWorkshop: number) {
        return this.http.get(config.backend_uri + `/message/conversation?idWorkshop=${idWorkshop}&participant=${participant}`);
    }

}
