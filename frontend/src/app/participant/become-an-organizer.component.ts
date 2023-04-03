import {Component, OnInit, ViewChild} from '@angular/core';
import {getUser} from "../utils";
import {Field} from "../form/field";
import {Button} from "../form/button";
import {WorkshopService} from "../workshop.service"
import {MapComponent} from "../map/map.component";
import {FormComponent} from "../form/form.component";
import {fiveFilesMax, imageDimensions, inFuture, positive, required} from "../form/validators";
import {Router} from "@angular/router";


@Component({
    selector: 'become-an-organizer',
    template: `
        <h1> Become an organizer </h1>

        <app-form
                #fields
                [fieldsToInclude]="formFields"
                formClasses="col-lg-4 col-md-6 offset-md-3 offset-lg-4 col-12">
        </app-form>
        <app-map searchBarId="address"></app-map>
        <app-form
                [buttons]="formButtons"
                formClasses="col-lg-4 col-md-6 offset-md-3 offset-lg-4 col-12">
        </app-form>

    `
})
export class BecomeAnOrganizerComponent implements OnInit {

    @ViewChild(MapComponent) map: MapComponent;
    @ViewChild('fields') form: FormComponent;
    formFields: Field[] = [
        new Field({
            caption: 'Workshop name',
            inputType: 'text',
            id: 'name',
            validators: [required]
        }),
        new Field({
            caption: 'Place',
            inputType: 'text',
            id: 'place',
            validators: [required]
        }),
        new Field({
            caption: 'Time and date',
            inputType: 'datetime-local',
            id: 'dateTime',
            errors: {
                inPast: "The chosen time is in the past.",
                required: "Time and date is required."
            },
            validators: [required, inFuture]
        }),
        new Field({
            caption: 'Spots',
            inputType: 'number',
            id: 'spots',
            validators: [required, positive],
            errors: {
                positive: 'Value must be positive'
            }
        }),
        new Field({
            caption: 'Short description',
            inputType: 'text',
            id: 'description',
        }),
        new Field({
            caption: 'Long description',
            inputType: 'text',
            id: 'long_description',
        }),
        new Field({
            caption: 'Main image',
            inputType: 'file',
            accept: "image/*",
            id: 'main_image',
            errors: {
                required: "Main image is required.",
                dimensions: "Image dimensions must be between 100px and 300px"
            },
            validators: [required, imageDimensions]
        }),
        new Field({
            caption: 'Images for gallery',
            inputType: 'file',
            accept: "image/*",
            id: 'gallery',
            multiple: true,
            errors: {
                tooManyImages: "You can upload 5 images max.",
                dimensions: "Image dimensions must be between 100px and 300px"
            },
            validators: [fiveFilesMax, imageDimensions],
        }),
        new Field({
            caption: 'Search for address',
            inputType: 'text',
            id: 'address',
            info: 'Drop a pin by right-clicking!',
            errors: {
                requiredLocation: "Workshop location is required!"
            },
            displayShadow: false,
            validators: [this.locationRequired.bind(this)],
            prependText: '<i class="bi bi-x-lg"></i>',
            prependClick: () => {
                this.map.clearSearchMarkers();
                this.form.fields.address.setValue(null);
            }
        }),
    ]
    formButtons = [
        new Button({
            click: this.createWorkshop.bind(this),
            caption: "Create a Workshop",
            classes: "col-12"
        })
    ]

    constructor(private workshopService: WorkshopService, private router: Router) {
    }

    ngOnInit(): void {
    }

    async createWorkshop() {
        await this.form.validate();
        if (this.form.invalid) return;

        let data = this.form.getFormData({exclude: ['gallery']})
        data.append('organizer', getUser().username);
        data.append('map', this.map.location.lat + ',' + this.map.location.lng)

        this.workshopService.add(data).subscribe((resp: any) => {
            if (this.form.fields.gallery.files.length == 0) {
                alert("Workshop is successfully created!")
                this.router.navigate([''])
                return;
            }

            data = this.form.getFormData({include: ['gallery']})
            data.append('idWorkshop', resp.idWorkshop)

            this.workshopService.uploadGallery(data).subscribe(resp => {
                alert("Workshop is successfully created!")
                this.router.navigate([''])
            })

        })
    }

    locationRequired(value: any) {
        return (this.map?.location == null) ? ['requiredLocation'] : null;
    }
}

