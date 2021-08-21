window.onload = function () {
    const addLocationsBtn = document.querySelector(".extralocations")
    // const extraLocations = document.querySelector("#extraLocationsContainer")
    const locationsForm = document.querySelectorAll("[id^='location']")
    // console.log(locationsForm[0])

    // console.log(extraLocations.children[0])
    let i = 0
    if (addLocationsBtn) {
        addLocationsBtn.addEventListener('click', (e) => {
            e.preventDefault()
            if (i < 3) {
                const location = locationsForm[i]
                console.log(location)
                location.classList.remove("hidden")
                i++
                console.log(i)
            } else {
                addLocationsBtn.removeEventListener("click", () => { })
            }
        })
    }

}
