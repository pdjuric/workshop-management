export class Message {

    sentByParticipant: boolean;
    text: string;

    constructor(data: any) {
        Object.assign(this, data);
    }

    _dateTime: string | Date;

    get dateTime(): string {
        return this._dateTime.toLocaleString();
    }

    set dateTime(dateTime: string | Date) {
        this._dateTime = new Date(dateTime);
        if (this._dateTime.toLocaleString() == "Invalid Date") this._dateTime = dateTime;
    }

}
