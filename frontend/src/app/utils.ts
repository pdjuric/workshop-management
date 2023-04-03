import {FormGroup} from "@angular/forms";
import config from "./../../config.json";

export let imageUri = config.backend_uri + '/image/'

export function makeForm(formFields): FormGroup {
    return new FormGroup(formFields.reduce((obj, item) => {
        let childrenFields = {}
        if (item.children) for (let child of item.children) childrenFields[child["id"]] = child["control"];

        return {
            ...obj, [item["id"]]: item["control"], ...childrenFields
        };
    }, {}));
}

export function getUser(): any {
    return JSON.parse(sessionStorage.getItem('user'));
}
