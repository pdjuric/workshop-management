export class Comment {
    idComment: number;
    text: string;
    private _dateTime: Date = new Date();

    get dateTime(): string {
        return this._dateTime.toLocaleString();
    }

    set dateTime(dateTime: string) {
        this._dateTime = new Date(dateTime);
    }
}
