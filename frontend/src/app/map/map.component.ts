import {Component, Input, OnInit, Output} from '@angular/core';
import {Loader} from "@googlemaps/js-api-loader";
import config from "../../../config.json";

@Component({
    selector: 'app-map',
    template: '<div class="col-lg-4 col-md-6 offset-md-3 offset-lg-4 col-12" style="height: 400px;" id="map" ></div>'
})
export class MapComponent implements OnInit {

    @Input() searchBarId;
    @Input() lat: number = 44.80317190524016;
    @Input() lng: number = 20.471525008234824;

    @Input() setMarker = false;
    map: google.maps.Map;
    searchBox: google.maps.places.SearchBox;
    marker: google.maps.Marker = null;
    @Output() location = null;
    searchMarkers: google.maps.Marker[] = [];

    ngOnInit(): void {
        new Loader({
            apiKey: config.api_key, libraries: ["places"]
        })
            .load()
            .then(() => {
                this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
                    center: {lat: Number(this.lat), lng: Number(this.lng)}, zoom: 13, mapTypeId: "roadmap",
                });

                const input = document.getElementById("address") as HTMLInputElement;
                this.searchBox = new google.maps.places.SearchBox(input);

                this.map.addListener("bounds_changed", this.bounds_changed.bind(this));
                this.map.addListener("rightclick", this.selectPlace.bind(this));
                this.searchBox.addListener("places_changed", this.places_changed.bind(this));

                if (this.setMarker) this.selectPlace({
                    latLng: {
                        lat: () => Number(this.lat), lng: () => Number(this.lng),
                    }
                })

            });
    }

    selectPlace(event) {
        this.marker?.setMap(null);
        this.location = {
            lat: event.latLng.lat(), lng: event.latLng.lng(),
        }
        console.log(this.location)
        this.marker = new google.maps.Marker({
            position: this.location, animation: google.maps.Animation.DROP, draggable: true, map: this.map
        });
    }

    bounds_changed() {
        this.searchBox.setBounds(this.map.getBounds() as google.maps.LatLngBounds);
    }

    clearSearchMarkers() {
        this.searchMarkers.forEach(marker => marker.setMap(null));
        this.searchMarkers = [];
    }

    places_changed() {
        const places = this.searchBox.getPlaces();
        if (places.length == 0) return;

        this.clearSearchMarkers();

        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds();

        places.forEach((place) => {
            if (!place.geometry || !place.geometry.location) {
                console.log("Returned place contains no geometry");
                return;
            }

            const icon = {
                url: place.icon as string,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25),
            };

            // Create a marker for each place.
            this.searchMarkers.push(new google.maps.Marker({
                map: this.map, icon: icon, title: place.name, position: place.geometry.location,
            }));

            if (place.geometry.viewport) bounds.union(place.geometry.viewport); else bounds.extend(place.geometry.location);
        });
        this.map.fitBounds(bounds);
    }

}
