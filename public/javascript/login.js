const loginForm = document.querySelector('.form--login');
const logout = document.querySelector("#logout");
const userDataForm = document.querySelector('.form-user-data');
const userEditData = document.querySelector('.form--edit');
const deleteBooking = document.querySelector("#deleteBooking");
const newReview = document.querySelector(".reviewer");

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;


        fetch("/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(response => response.json())
            .then(res => {
                if (res.data) {
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
        fetch("/logout")
            .then(response => response.json())
            .then(res => {
                if (res.message == "logged out") {
                    window.setTimeout(() => {
                        location.assign('/');
                    }, 700);
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

        fetch("/register", {
            method: "POST",
            body: form
        }).then(response => response.json())
            .then(res => {
                window.setTimeout(() => {
                    location.assign('/');
                }, 500);

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

        fetch("/updateProfile", {
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

if (deleteBooking) {
    deleteBooking.addEventListener("click", () => {
        // console.log(deleteTour.dataset.bookingid)

        const url = `/myBookings/${deleteTour.dataset.bookingid}`;

        // console.log(`http://localhost:3001${url}`)


        fetch(`${url}`, {
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

