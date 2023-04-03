export class Message {

    sentByParticipant: boolean;
    text: string;

    constructor(data: any) {
        Object.assign(this, data);
    }

    private _dateTime: Date;

    get dateTime(): string {
        return this._dateTime.toLocaleString();
    }

    set dateTime(dateTime: string) {
        this._dateTime = new Date(dateTime);
    }

}
