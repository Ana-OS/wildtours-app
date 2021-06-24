const loginForm = document.querySelector('.form--login');
console.log(loginForm)

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
                window.alert('success', 'Logged in successfully!');
                window.setTimeout(() => {
                    location.assign('/');
                }, 1500);
            }
        });
});