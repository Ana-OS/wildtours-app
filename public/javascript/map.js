let locations = [JSON.parse(document.querySelector("#map").dataset.startlocations), JSON.parse(document.querySelector("#map").dataset.endlocations)]
let extraLocations = JSON.parse(document.querySelector("#map").dataset.locations)
let coordinates = []

for (i = extraLocations.length - 1; i >= 0; i--) {
    if (extraLocations[i].address !== "") {
        locations.splice(1, 0, extraLocations[i])
    }
}


mapboxgl.accessToken = document.querySelector("#map").dataset.mapbox

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    scrollZoom: true,
    interactive: true
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
    coordinates.push(loc.coordinates)
    new mapboxgl.Popup({
        offset: 30
    })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.place}</p>`)
        .addTo(map);
    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
    padding: {
        top: 10,
        bottom: 12,
        left: 10,
        right: 10
    }
});
// console.log(coordinates)


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
            'line-width': 3
        }
    });
})
