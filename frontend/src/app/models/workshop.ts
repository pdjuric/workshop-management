export class Workshop {
    spots_left: number;
    idWorkshop: number;
    main_image: string;
    name: string;
    place: string;
    description: string;
    long_description: string;
    organizer: string;
    spots: number;
    gallery: any[] = [];
    map: string;
    like_count: number;
    confirmed: number | null = null;

    constructor(data: any) {
        Object.assign(this, data);
    }

    _dateTime: Date = new Date();

    get dateTime(): string {
        return this._dateTime.toLocaleString();
    }

    set dateTime(dateTime: string) {
        this._dateTime = new Date(dateTime);
    }

    isBefore(w: Workshop): boolean {
        return this._dateTime.getTime() < w._dateTime.getTime();
    }

    isAfter(d: Date): boolean {
        return d.getTime() < this._dateTime.getTime();
    }

}
