import {Component, OnInit, ViewChild} from '@angular/core';
import {getUser, imageUri} from "../utils";
import {Field} from "../form/field";
import {Button} from "../form/button";
import {WorkshopService} from "../workshop.service"
import {MapComponent} from "../map/map.component";
import {FormComponent} from "../form/form.component";
import {imageDimensions, inFuture, positive, required} from "../form/validators";
import {Router} from "@angular/router";


@Component({
    selector: 'new-workshop',
    template: `
        <h1> New workshop </h1>
        
        <app-form
                #fields
                [fieldsToInclude]="formFields"
                formClasses="col-lg-4 col-md-6 offset-md-3 offset-lg-4 col-12">
        </app-form>
        <app-map searchBarId="address"></app-map>
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
export class NewWorkshopComponent implements OnInit {

    @ViewChild(MapComponent) map: MapComponent;
    @ViewChild('fields') form: FormComponent;
    @ViewChild('gallery') galleryForm: FormComponent;
    formFields: Field[] = [
        new Field(
            {
                caption: 'Template',
                inputType: 'file',
                accept: "application/JSON",
                id: 'template',
                change: this.getTemplate.bind(this)
            }
        ),
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
    galleryFields: Field[] = [
        new Field({
            caption: 'Image 1',
            inputType: 'file',
            accept: "image/*",
            id: 'gallery0',
            errors: {
                dimensions: "Image dimensions must be between 100px and 300px"
            },
            validators: [imageDimensions]
        }),
        new Field({
            caption: 'Image 2',
            inputType: 'file',
            accept: "image/*",
            id: 'gallery1',
            errors: {
                dimensions: "Image dimensions must be between 100px and 300px"
            },
            validators: [imageDimensions]
        }),
        new Field({
            caption: 'Image 3',
            inputType: 'file',
            accept: "image/*",
            id: 'gallery2',
            errors: {
                dimensions: "Image dimensions must be between 100px and 300px"
            },
            validators: [imageDimensions]
        }),
        new Field({
            caption: 'Image 4',
            inputType: 'file',
            accept: "image/*",
            id: 'gallery3',
            errors: {
                dimensions: "Image dimensions must be between 100px and 300px"
            },
            validators: [imageDimensions]
        }),
        new Field({
            caption: 'Image 5',
            inputType: 'file',
            accept: "image/*",
            id: 'gallery4',
            errors: {
                dimensions: "Image dimensions must be between 100px and 300px"
            },
            validators: [imageDimensions]
        }),
    ]
    formButtons = [
        new Button({
            click: this.createWorkshop.bind(this),
            caption: "Create a Workshop",
            classes: "col-12"
        })
    ]

    constructor(private workshopService: WorkshopService,
                private router: Router) {
    }

    ngOnInit(): void {
    }

    getTemplate(event) {
        console.log((event.target as HTMLInputElement).files[0])

        let file = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsText(file, "UTF-8");
        fileReader.onerror = (error) => {
            console.log(error);
        }


        fileReader.onload = () => {
            let data = JSON.parse(fileReader.result as string)
            console.log(data);

            for (let field of this.formFields) {
                if (field.inputType != 'file' && field.id in data)
                    field.value = data[field.id]
                if (field.id == 'dateTime') {
                    field.value = new Date(data.dateTime).toISOString().substring(0, 16)
                }
                if (field.id == 'main_image') {
                    field.imgSrc = imageUri + data.main_image
                }
            }

            let i = 0
            data['gallery'].forEach(t => {
                if (t != null) this.galleryFields[i].imgSrc = imageUri + t
                i++
            })


            let coords = (data['map'] as string).split(',')


            this.map.selectPlace({
                latLng: {
                    lat: () => Number(coords[0]),
                    lng: () => Number(coords[1]),
                }
            })

            this.map.map.panTo({lat: Number(coords[0]), lng: Number(coords[1])})


        }
    }


    async createWorkshop() {
        await this.form.validate();
        await this.galleryForm.validate()

        if (this.form.invalid || this.galleryForm.invalid) return;

        let data = this.form.getFormData({exclude: ['gallery']})
        data.append('organizer', getUser().username);
        data.append('map', this.map.location.lat + ',' + this.map.location.lng)

        if (this.form.fields.main_image.imgSrc != null && this.form.fields.main_image.files == null) {
            let src: string = this.form.fields.main_image.imgSrc

            src = src.substring(src.lastIndexOf('/') + 1)
            data.append('old_main_image', src)
        }

        let existingImages = []
        let i = 0
        this.galleryForm.fieldsToInclude
            .forEach(f => {
                if (f.imgSrc != null && f.files == null) {
                    console.log(f.imgSrc)
                    existingImages.push({no: i, image: f.imgSrc.substring(f.imgSrc.lastIndexOf('/') + 1)})
                }
                i++
            })
        data.append('existingImages', JSON.stringify(existingImages));
        data.append('isAdmin', getUser().user_type == 'admin' ? "true" : "false")
        data.delete('template')
        var object = {};
        data.forEach((value, key) => object[key] = value);
        console.log(object)

        this.workshopService.add(data).subscribe((resp: any) => {

            let idWorkshop = resp.idWorkshop

            let i = 0;
            this.galleryForm.fieldsToInclude
                .forEach(f => {
                    console.log(f)
                    if (f.files != null) {
                        console.log(f.files)
                        this.workshopService.editGallery(idWorkshop, i, f.files?.[0]).subscribe(res => {
                        })
                    }
                    i++
                })
            alert("Workshop is successfully created!")
            this.router.navigate([''])
        })

    }

    locationRequired(value: any) {
        return (this.map?.location == null) ? ['requiredLocation'] : null;
    }
}


