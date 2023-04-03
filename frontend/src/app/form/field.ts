export class Field {

    caption: string = '';
    inputType: string = '';
    id: string = '';
    errors: any[] = [];
    prependClick: (e) => void = null;
    prependText: string = null
    showCondition: string = '';
    show: boolean = true;
    editCondition: string = '';
    edit: boolean = true;
    children: Field[] = [];
    accept: string = null;
    removable = true;
    multiple: boolean = false;
    info: string = null;
    displayShadow: boolean = true;
    value: any = null;
    files: FileList = null;
    _errors: string[] = [];
    validators: any[] = []
    imgSrc: string = null;
    touched = false

    constructor(data: any) {
        if (data.inputType == 'file') this.value = null;
        if (data.inputType == 'switch') this.value = false;

        Object.keys(data).filter(k => !(k in this)).forEach(k => console.log("Key '" + k + "' unused."));
        Object.assign(this, data)
        if ('change' in data) this.change = data['change']
    }

    _validated: boolean = false;

    get validated() {
        return this._validated;
    }

    set validated(value: boolean) {
        if (value == false) this.children.forEach(f => f.validated = value);
        this._validated = value;
    }

    get valid() {
        return this._errors.length == 0;
    }

    get invalid() {
        return this._errors?.length > 0;
    }

    change: (e) => void = (e) => {
    };

    setError(error: string) {
        this._errors.push(error)
        this.validated = true;
    }

    getErrors() {
        return this._errors.map(e => this.errors[e]);
    }

    focus(element: HTMLElement) {
        if (!this.edit) element.blur();
    }

    click(event) {
        if (this.prependClick != null) this.prependClick(event);
    }

    onChange(event) {

        if (this.inputType == 'file') {
            this.touched = true
            this.files = (event.target as HTMLInputElement).files
            if (this.multiple == false) {
                this.imgSrc = window.URL.createObjectURL(this.files[0])
            }
        }

        this.change(event);
        this.validate();
    }

    conditionChanged(condition: string) {
        if (this.showCondition == condition) this.show = !this.show
        if (this.editCondition == condition) this.edit = !this.edit
    }

    async validate() {
        for (let c of this.children) await c.validate()

        this._errors = [];
        for (let v of this.validators) {
            let error: string[] = await v(this.inputType != 'file' ? this.value : this.files)

            console.log(this.id)
            console.log(error)
            console.log(this.imgSrc)
            if (error != null && this.id == 'main_image' && this.imgSrc != null) {
                error = error.filter(t => t != 'required');
                if (error == []) error = null
            }
            console.log(error)
            if (error != null) this._errors.push(...error);
        }
        this.validated = true;
    }

    reset() {
        this._errors = [];
        this.value = null;
        this.validated = false;
        this.files = null;
    }

    removeImg(event) {
        this.touched = true;
        this.files = null;
        this.value = null;
        this.imgSrc = null;
        (event.target as HTMLInputElement).files = null;
        (event.target as HTMLInputElement).removeAttribute('value')

    }
}
