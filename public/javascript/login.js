const loginForm = document.querySelector('.form--login');
const logout = document.querySelector("#logout");
const userDataForm = document.querySelector('.form-user-data');
const userEditData = document.querySelector('.form--edit');
const deleteTour = document.querySelector("#deleteBooking");

// console.log(register)
// console.log(account)

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        // console.log({ email })
        // console.log({ password })

        fetch("http://localhost:3001/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(response => response.json())
            .then(res => {
                console.log(res)
                // console.log(res.data.user.name)
                if (res.data) {
                    console.log(`res user logged in`)
                    // console.log(res)
                    window.alert('success', 'Logged in successfully!');
                    window.setTimeout(() => {
                        location.assign('/');
                    }, 700);
                } else {
                    window.alert('wrong credentials');
                    window.setTimeout(() => {
                        location.assign('/login');
                    }, 700);

                }
            })
    });
}

if (logout) {
    logout.addEventListener('click', () => {
        fetch("http://localhost:3001/logout")
            .then(response => response.json())
            .then(res => {
                console.log(res)
                if (res.message == "logged out") {
                    console.log("logge outd")
                    location.reload()
                }
            });
    });
};

if (userDataForm) {
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        // const name = document.getElementById('name').value
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('password', document.getElementById('password').value);
        form.append('confirmPassword', document.getElementById('confirm_password').value);
        form.append('photo', document.getElementById('photo').files[0]);
        // console.log(form)
        console.log(form);

        fetch("http://localhost:3001/register", {
            method: "POST",
            body: form
        }).then(response => response.json())
            .then(res => {
                console.log(res)

            });

    })
}

if (userEditData) {
    userEditData.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        // const name = document.getElementById('name').value
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        // console.log(form)
        // console.log(form);

        fetch("http://localhost:3001/updateProfile", {
            method: "POST",
            body: form
        }).then(response => response.json())
            .then(res => {
                // console.log(res)
                if (res.data) {
                    // window.alert('success', 'Logged in successfully!');
                    window.setTimeout(() => {
                        location.assign('/');
                    }, 500);
                }
            });

    })
}

if (deleteTour) {
    deleteTour.addEventListener("click", () => {
        // console.log(deleteTour.dataset.bookingid)

        const url = `/myBookings/${deleteTour.dataset.bookingid}`;

        // console.log(`http://localhost:3001${url}`)


        fetch(`http://localhost:3001${url}`, {
            method: "DELETE",
            body: null
        })
            .then(res => res.json())
            .then(res => {
                if (res.message == "booking deleted")
                    location.reload()
            })
            .catch(err => console.log(err))
    })

}