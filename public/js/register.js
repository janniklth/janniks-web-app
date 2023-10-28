console.log('register.js loaded');

// get the elements
const registerForm = document.getElementById('registerForm');
const registerFirstName = document.getElementById('registerFirstName');
const registerLastName = document.getElementById('registerLastName');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');

registerForm.addEventListener('submit', function (e) {
    // prevent default form action from being carried out
    e.preventDefault();

    // get data from the form
    const formData = {
        firstName: registerFirstName.value,
        lastName: registerLastName.value,
        email: registerEmail.value,
        password: registerPassword.value
    };

    // send the data via POST request to the server
    fetch('/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            console.log(response);
            if (response.status === 200) {
                alert('Registrierung erfolgreich!');
                // TODO: redirect to ...
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