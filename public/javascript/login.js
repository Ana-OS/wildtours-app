const loginForm = document.querySelector('.form--login');
const logout = document.querySelector("#logout");
const registerForm = document.querySelector(".form--register");
const account = document.querySelector(".form--account");
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
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(response => response.json())
            .then(res => {
                console.log(res.data.user.name)
                if (res.data.user.name) {
                    // window.alert('success', 'Logged in successfully!');
                    window.setTimeout(() => {
                        location.assign('/');
                    }, 700);
                }
            });
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

if (registerForm) {
    registerForm.addEventListener("submit", e => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        const confirmPassword = document.querySelector("#confirm_password").value;
        // console.log({ name })
        // console.log({ email })

        fetch("http://localhost:3001/register", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, confirmPassword })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)

            })
    })
}


