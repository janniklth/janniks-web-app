console.log('login.js loaded');

// get the elements
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');

loginForm.addEventListener('submit', function (e) {
    // prevent default form action from being carried out
    e.preventDefault();

    // get data from the form
    const formData = {
        email: loginEmail.value,
        password: loginPassword.value
    };

    // send the data via POST request to the server
    fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            console.log(response);
            if (response.status === 200) {
                // alert('Login erfolgreich!');
                // redirect to homepage
                window.location.href = '/';
            } else {
                return response.text().then(text => {
                    throw new Error(text)
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ein Fehler ist aufgetreten: ' + error.message);
        });
});
