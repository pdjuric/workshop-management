import {getUser} from "../utils";

export async function passwordValidator(value: string) {
    if (value == '' || value == null) return null;
    let errors = [];

    if (!new RegExp("^[a-zA-Z]").test(value)) errors.push('letterStart')
    if (!new RegExp("[A-Z]").test(value)) errors.push('uppercase')
    if (!new RegExp("[^a-zA-Z0-9]").test(value)) errors.push('special')
    if (!new RegExp("^.{8,16}$").test(value)) errors.push('length')
    if (!new RegExp("[0-9]").test(value)) errors.push('number')

    return Object.keys(errors).length == 0 ? null : errors;
}


export async function required(value: any) {
    return ((value == null || value == '')) ? ['required'] : null;
}

export async function inFuture(value: any) {
    return (new Date(value) < new Date()) ? ['inPast'] : null;
}

export async function email(value: string) {
    return (new RegExp("^[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.]+$").test(value)) ? null : ['email'];
}

export async function fiveFilesMax(files: FileList) {
    return files?.length > 5 ? ['tooManyImages'] : null;
}

export async function positive(value: number) {
    return value <= 0 ? ['positive'] : null;
}

export async function imageDimensions(files: FileList) {
    for (let i = 0; i < files?.length; i++) {
        let dimensions = await readFileAsync(files[i]);

        if (dimensions['width'] < 100 || dimensions['width'] > 300 || dimensions['height'] < 100 || dimensions['height'] > 300) {
            return ['dimensions']
        }

    }
    return null;
}


function readFileAsync(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = (e) => {

            let image = new Image();
            image.src = e.target.result as string;

            image.onload = function () {
                resolve({
                    height: image.height, width: image.width
                });
            };

        };

    })
}

export async function oldPassword(value: string) {
    let oldPassword = getUser().password
    let newPassword = ''
    let date = getUser()['temp_dateTime']
    if (date != null && new Date().getTime() < new Date(date).getTime()) {
        newPassword = getUser().temp_password
    }
    return (value == oldPassword || value == newPassword) ? null : ['oldPassword']

}
