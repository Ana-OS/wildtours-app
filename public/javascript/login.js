const loginForm = document.querySelector('.form--login');
const logout = document.querySelector(".logout");
const register = document.querySelector('.form-user-data');
const userEditData = document.querySelector('.form--edit');
const deleteBooking = document.querySelector("#deleteBooking");
const newReview = document.querySelector(".reviewer");

const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg, time = 7) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, time * 500);
};

const editUser = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/updateProfile',
            data
        });
        console.log()
        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 700);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}


const registerUser = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/register',
            data
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 700);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/login',
            data: {
                email,
                password
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 700);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

if (userEditData) {
    userEditData.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        editUser(form);
    });
}

if (register) {
    register.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('password', document.getElementById('password').value);
        form.append('confirmPassword', document.getElementById('confirm_password').value);
        form.append('photo', document.getElementById('photo').files[0]);
        // console.log(form.entries)
        registerUser(form)
    });
}
if (loginForm)
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });

const logoutUser = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/logout'
        });
        if ((res.data.status = 'success')) window.location.reload();;
    } catch (err) {
        console.log(err.response);
        showAlert('error', 'Error logging out! Try again.');
    }
};
if (logout) {
    logout.addEventListener('click', logoutUser);
}