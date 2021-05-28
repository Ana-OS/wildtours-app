let map;
function initMap() {
    const map_coor = JSON.parse(document.querySelector(".map").dataset.locations)
    const place = { lat: map_coor[1], lng: map_coor[0] };
    // The map, centered at Uluru
    map = new google.maps.Map(document.querySelector(".map"), {
        zoom: 10,
        center: place,
    });
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
        position: place,
        map: map,
    });

    marker.addListener('click', function () {
        console.log(this.position);
        // const html = `
        //         <div class="popup">
        //         <a href="/store/${this.place.slug}">
        //             <img src="/uploads/${this.place.photo || 'store.png'}" alt="${this.place.name}" />
        //             <p>${this.place.name} - ${this.place.location.address}</p>
        //         </a>
        //         </div>
        //     `;
        // infoWindow.setContent(html);
        // infoWindow.open(map, this);
    });


    // const infoWindow = new google.maps.InfoWindow();

}



// const mapOptions = {
//     center: { lat: 43.2, lng: -79.8 },
//     zoom: 10
// };

// function loadPlaces(map, lat = 43.2, lng = -79.8) {
//     axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`)
//         .then(res => {
//             const places = res.data;
//             if (!places.length) {
//                 alert('no places found!');
//                 return;
//             }
//             // create a bounds
//             const bounds = new google.maps.LatLngBounds();
//             const infoWindow = new google.maps.InfoWindow();

//             const markers = places.map(place => {
//                 const [placeLng, placeLat] = place.location.coordinates;
//                 const position = { lat: placeLat, lng: placeLng };
//                 bounds.extend(position);
//                 const marker = new google.maps.Marker({ map, position });
//                 marker.place = place;
//                 return marker;
//             });

//             // when someone clicks on a marker, show the details of that place
//             markers.forEach(marker => marker.addListener('click', function () {
//                 console.log(this.place);
//                 const html = `
//           <div class="popup">
//             <a href="/store/${this.place.slug}">
//               <img src="/uploads/${this.place.photo || 'store.png'}" alt="${this.place.name}" />
//               <p>${this.place.name} - ${this.place.location.address}</p>
//             </a>
//           </div>
//         `;
//                 infoWindow.setContent(html);
//                 infoWindow.open(map, this);
//             }));

//             // then zoom the map to fit all the markers perfectly
//             map.setCenter(bounds.getCenter());
//             map.fitBounds(bounds);
//         });

// }

// function makeMap(mapDiv) {
//     if (!mapDiv) return;
//     // make our map
//     const map = new google.maps.Map(mapDiv, mapOptions);
//     loadPlaces(map);

//     const input = $('[name="geolocate"]');
//     const autocomplete = new google.maps.places.Autocomplete(input);
//     autocomplete.addListener('place_changed', () => {
//         const place = autocomplete.getPlace();
//         loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng());
//     });
// }

