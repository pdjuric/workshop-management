import {Component, Input, OnInit} from '@angular/core';
import {Field} from "./field";
import {Button} from "./button";

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

    @Input() fieldsToInclude: Field[] = [];


    @Input() formClasses: string = '';
    @Input() buttons: Button[];

    get fields(): any {
        return this.fieldsToInclude.reduce((obj, item) => {
            return {
                ...obj,
                [item["id"]]: item,
            };
        }, {})
    }

    get invalid() {
        return this.fieldsToInclude.filter(f => f.invalid).length > 0;
    }

    ngOnInit(): void {
    }

    fieldsToRender() {
        return this.fieldsToInclude?.filter(field => field.show);
    }

    buttonsToRender() {
        return this.buttons?.filter(btn => btn.show);
    }

    async validate(except: string[] = []) {
        let fields = []
        this.fieldsToInclude
            .filter(f => !(f.id in except))
            .forEach(f => {
                fields.push(f)
            })

        for (let f of fields)
            await f.validate();
    }

    getFormData(spec: any = {}): FormData {
        let data = new FormData();
        this.fieldsToInclude
            .filter(f => spec?.include?.includes(f.id) ?? true)
            .filter(f => !spec?.exclude?.includes(f.id) ?? true)
            .forEach(f => {
                console.log(f.id)
                if (f.inputType == 'file')
                    for (let i = 0; i < f.files?.length ?? 0; i++)
                        data.append(f.id, f.files[i])

                else {
                    data.append(f.id, f.value)
                    f.children.forEach(c => data.append(c.id, c.value))
                }
            })
        return data;
    }

    getData(except: string[] = []): any {
        let data = {};
        this.fieldsToInclude
            .filter(f => !(f.id in except))
            .forEach(f => {
                // files will be send through FormData only
                if (f.inputType != 'file') {
                    data[f.id] = f.value
                    console.log(f.value)
                }

                f.children.forEach(c => data[c.id] = c.value)
            })
        return data;
    }

}
