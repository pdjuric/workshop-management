export class Button {
    caption: string;
    classes: string;
    showCondition: string;
    show: boolean;

    constructor(data: any) {
        this.caption = data.caption;
        if ('click' in data) this.click = data.click;
        this.showCondition = data.showCondition ?? '';
        this.show = data.show ?? true;
        this.classes = data.classes ?? '';
    }

    click: () => void = () => {
    };

    conditionChanged(condition: string) {
        if (this.showCondition == condition) this.show = !this.show
    }

}


