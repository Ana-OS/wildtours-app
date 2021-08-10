
let locations = [JSON.parse(document.querySelector("#map").dataset.startlocations), JSON.parse(document.querySelector("#map").dataset.endlocations)]

let extraLocations = JSON.parse(document.querySelector("#map").dataset.locations)
console.log(extraLocations)
for (i = extraLocations.length - 1; i >= 0; i--) {
    locations.splice(1, 0, extraLocations[i])
}

console.log(locations)

let coordinates = []
// 33.20259230265763, -117.38440678435028
// [JSON.parse(document.querySelector("#map").dataset.startlocations), JSON.parse(document.querySelector("#map").dataset.endlocations)]
// console.log(extraLocations)
mapboxgl.accessToken =
    'pk.eyJ1IjoiYW5hb3MiLCJhIjoiY2tzM3B6eXEyMGtwYjJwbmp4cmprZDdsMSJ9.W9wwXWCTw1knzg-AdBHGhQ';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    scrollZoom: true,
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    interactive: true
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
    // console.log(loc)
    coordinates.push(loc.coordinates)
    // Create marker
    const marker = document.createElement('div');
    marker.className = 'marker';
    // const img = document.createElement('img');
    // marker.appendChild(img)

    // Add marker
    new mapboxgl.Marker({
        element: marker,
        anchor: 'bottom'
    })
        .setLngLat(loc.coordinates)
        .addTo(map);

    // Add popup
    new mapboxgl.Popup({
        offset: 30
    })
        .setLngLat(loc.coordinates)
        .setHTML(`<div class="popoUp_div"><p>${loc.day} at ${loc.place}</p></div>`)
        .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
});
// console.log(coordinates)

map.fitBounds(bounds, {
    padding: {
        top: 10,
        bottom: 12,
        left: 10,
        right: 10
    }
});
map.on('load', () => {
    map.addSource('route', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': coordinates
            }
        }
    });

    map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': 'green',
            'line-width': 8
        }
    });
})
// function initMap() {
//     const map_coor = [JSON.parse(document.querySelector(".map").dataset.startlocations), JSON.parse(document.querySelector(".map").dataset.endlocations)]
//     console.log(map_coor)
    // const place = { lat: map_coor[1], lng: map_coor[0] };
    // // The map, centered at Uluru
    // map = new google.maps.Map(document.querySelector(".map"), {
    //     zoom: 10,
    //     center: place,
    // });
    // // The marker, positioned at Uluru
    // const marker = new google.maps.Marker({
    //     position: place,
    //     map: map,
    // });

    // marker.addListener('click', function () {
    //     // console.log(this);
    //     // const html = `
    //     //         <div class="popup">
    //     //         <a href="/store/${this.place.slug}">
    //     //             <img src="/uploads/${this.place.photo || 'store.png'}" alt="${this.place.name}" />
    //     //             <p>${this.place.name} - ${this.place.location.address}</p>
    //     //         </a>
    //     //         </div>
    //     //     `;
    //     // infoWindow.setContent(html);
    //     // infoWindow.open(map, this);
    // });


    // const infoWindow = new google.maps.InfoWindow();

// }



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

