window.onload = function () {
    const map = document.querySelector(".map");
    const input = document.querySelector("#address");
    let lat = document.querySelector("#lat");
    let lng = document.querySelector("#lng");

    // console.log(input.value)

    // // function autocomplete(input) {
    // const place = new google.maps.places.Autocomplete(input);

    // console.log(place)

    if (!input) return; // skip this fn from running if there is not input on the page
    const dropdown = new google.maps.places.Autocomplete(input);

    dropdown.addListener('place_changed', () => {
        const place = dropdown.getPlace();
        lat.value = place.geometry.location.lat();
        lng.value = place.geometry.location.lng();
        // console.log(lat)
    });

    // if someone hits enter on the address field, don't submit the form
    input.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) e.preventDefault();
    });
}
