import {Component, OnInit, ViewChild} from '@angular/core';
import {getUser, imageUri} from "../utils";
import {Field} from "../form/field";
import {Button} from "../form/button";
import {WorkshopService} from "../workshop.service"
import {MapComponent} from "../map/map.component";
import {FormComponent} from "../form/form.component";
import {imageDimensions, inFuture, positive, required} from "../form/validators";
import {ActivatedRoute, Router} from "@angular/router";
import {Workshop} from '../models/workshop';


@Component({
    selector: 'workshop-edit', template: `
        <h1> Edit Workshop </h1>

        <app-form
                #fields
                [fieldsToInclude]="formFields"
                formClasses="col-lg-4 col-md-6 offset-md-3 offset-lg-4 col-12">
        </app-form>
        <app-map [lat]="coord[0]" [lng]="coord[1]" [setMarker]="true" searchBarId="address"></app-map>

        <app-form
                #gallery
                [fieldsToInclude]="galleryFields"
                formClasses="col-lg-4 col-md-6 offset-md-3 offset-lg-4 col-12">
        </app-form>

        <app-form
                [buttons]="formButtons"
                formClasses="col-lg-4 col-md-6 offset-md-3 offset-lg-4 col-12">
        </app-form>

    `
})
export class WorkshopEditComponent implements OnInit {

    @ViewChild(MapComponent) map: MapComponent;
    @ViewChild('fields') form: FormComponent;
    @ViewChild('gallery') galleryForm: FormComponent;

    coord: any;
    workshop: Workshop;
    idWorkshop: string;
    formFields: Field[] = [new Field({
        caption: 'Workshop name', inputType: 'text', id: 'name', validators: [required]
    }), new Field({
        caption: 'Place', inputType: 'text', id: 'place', validators: [required]
    }), new Field({
        caption: 'Time and date', inputType: 'datetime-local', id: 'dateTime', errors: {
            inPast: "The chosen time is in the past.", required: "Time and date is required."
        }, validators: [required, inFuture]
    }), new Field({
        caption: 'Spots', inputType: 'number', id: 'spots', validators: [required, positive, (value) => {
            return value < this.workshop.spots ? ['moreThanLast'] : null
        }], errors: {
            moreThanLast: 'Cannot assign lesser value than previous.', positive: 'Value must be positive'
        }
    }), new Field({
        caption: 'Short description', inputType: 'text', id: 'description',
    }), new Field({
        caption: 'Long description', inputType: 'text', id: 'long_description',
    }), new Field({
        caption: 'Main image', inputType: 'file', accept: "image/*", id: 'main_image', removable: false, errors: {
            required: "Main image is required.", dimensions: "Image dimensions must be between 100px and 300px"
        }, validators: [imageDimensions]
    }), new Field({
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
    }),]
    formButtons = [new Button({
        click: () => this.router.navigate(['workshops']), caption: "Cancel", classes: "col-6"
    }), new Button({
        click: this.submit.bind(this), caption: "Edit", classes: "col-6"
    })]
    galleryFields: Field[] = [new Field({
        caption: 'Image 1', inputType: 'file', accept: "image/*", id: 'gallery0', errors: {
            dimensions: "Image dimensions must be between 100px and 300px"
        }, validators: [imageDimensions]
    }), new Field({
        caption: 'Image 2', inputType: 'file', accept: "image/*", id: 'gallery1', errors: {
            dimensions: "Image dimensions must be between 100px and 300px"
        }, validators: [imageDimensions]
    }), new Field({
        caption: 'Image 3', inputType: 'file', accept: "image/*", id: 'gallery2', errors: {
            dimensions: "Image dimensions must be between 100px and 300px"
        }, validators: [imageDimensions]
    }), new Field({
        caption: 'Image 4', inputType: 'file', accept: "image/*", id: 'gallery3', errors: {
            dimensions: "Image dimensions must be between 100px and 300px"
        }, validators: [imageDimensions]
    }), new Field({
        caption: 'Image 5', inputType: 'file', accept: "image/*", id: 'gallery4', errors: {
            dimensions: "Image dimensions must be between 100px and 300px"
        }, validators: [imageDimensions]
    }),]

    constructor(private workshopService: WorkshopService, private activatedRoute: ActivatedRoute, private router: Router) {
        this.activatedRoute.params.subscribe(params => {
            this.idWorkshop = params.idWorkshop
            this.workshopService.getForEdit(params.idWorkshop).subscribe(data => {

                let wdata = new Workshop(data)
                if (getUser().user_type != 'admin' && wdata.organizer != getUser().username) this.router.navigate(['']);
                this.workshop = wdata;
                this.coord = (wdata['map'] as string).split(',')


                for (let field of this.formFields) {
                    if (field.inputType != 'file' && field.id in wdata) field.value = wdata[field.id]
                    if (field.id == 'dateTime') {
                        field.value = wdata._dateTime.toISOString().substring(0, 16)
                    }
                    if (field.id == 'main_image') {
                        field.imgSrc = imageUri + wdata.main_image
                    }
                }
                data['gallery'].forEach(t => {
                    this.galleryFields[t.no].imgSrc = imageUri + t.image
                })

            })
        })
    }

    ngOnInit(): void {
    }

    async submit() {
        console.log(this.form)
        await this.form.validate();

        if (this.form.invalid) return;

        let data = this.form.getData()
        data['map'] = this.map.location.lat + ',' + this.map.location.lng;
        console.log(this.workshop.spots)
        console.log(data['spots'])
        if (this.workshop.spots < data['spots']) {
            console.log('true')
            data['new_spots'] = true
        }


        this.workshopService.edit(this.idWorkshop, data).subscribe((resp: any) => {

            let i = 0;
            this.galleryForm.fieldsToInclude
                .forEach(f => {
                    if (f.touched) {
                        console.log(f.files)
                        this.workshopService.editGallery(this.idWorkshop, i, f.files?.[0]).subscribe(res => {
                        })
                    }
                    i++
                })
            this.router.navigate(['workshops'])
        })
    }

    locationRequired(value: any) {
        return (this.map?.location == null) ? ['requiredLocation'] : null;
    }
}

