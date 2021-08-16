window.onload = function () {
    function onlyOne(checkbox) {
        const checkboxes = document.getElementsByName('difficulty')
        checkboxes.forEach((item) => {
            if (item !== checkbox) item.checked = false
        })
    }
}