window.onload = function () {
    console.log("I'm autocomplete")
    const map = document.querySelector(".map");

    //---------------------       Start Location     ----------------//

    const inputStartLocation = document.querySelector("#startLocation");
    let latStartLocation = document.querySelector("#latStartLocation");
    let lngStartLocation = document.querySelector("#lngStartLocation");


    if (!inputStartLocation) return; // skip this fn from running if there is not input on the page
    const dropdownStartLocation = new google.maps.places.Autocomplete(inputStartLocation);
    // console.log(dropdown)

    dropdownStartLocation.addListener('place_changed', () => {
        const place = dropdownStartLocation.getPlace();
        latStartLocation.value = place.geometry.location.lat();
        lngStartLocation.value = place.geometry.location.lng();

    });
    // if someone hits enter on the address field, don't submit the form
    inputStartLocation.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) e.preventDefault();
    });




    //--------------------       EXTRA LOCATIONS       --------------------//

    const extraLocation = document.querySelectorAll("[id^='location']")
    let inputExtraLocation;

    if (extraLocation.length > 0) {

        extraLocation.forEach(loc => {
            inputExtraLocation = loc.getElementsByTagName("input")[0]
            let latExtraLocation = loc.getElementsByTagName("input")[2]
            let lngExtraLocation = loc.getElementsByTagName("input")[1]
            // console.log(inputExtraLocation)
            // console.log(loc)\
            // console.log(latExtraLocation)
            const dropdownExtraLocation = new google.maps.places.Autocomplete(inputExtraLocation);
            // console.log(dropdown)

            dropdownExtraLocation.addListener('place_changed', () => {
                const place = dropdownExtraLocation.getPlace();
                latExtraLocation.value = place.geometry.location.lat();
                lngExtraLocation.value = place.geometry.location.lng();

            });
            // if someone hits enter on the address field, don't submit the form
            inputExtraLocation.addEventListener('keydown', (e) => {
                if (e.keyCode === 13) e.preventDefault();
            });

        })
        // console.log(inputExtraLocation)

    }
    // console.log(typeof (extraLocation))


    // --------------          End Location       ---------------//

    const inputEndLocation = document.querySelector("#endLocation");
    let latEndLocation = document.querySelector("#latEndLocation");
    let lngEndLocation = document.querySelector("#lngEndLocation");


    if (!inputEndLocation) return; // skip this fn from running if there is not input on the page
    const dropdownEndLocation = new google.maps.places.Autocomplete(inputEndLocation);
    // console.log(dropdown)

    dropdownEndLocation.addListener('place_changed', () => {
        const place = dropdownEndLocation.getPlace();
        latEndLocation.value = place.geometry.location.lat();
        lngEndLocation.value = place.geometry.location.lng();

    });
    // if someone hits enter on the address field, don't submit the form
    inputEndLocation.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) e.preventDefault();
    });
}