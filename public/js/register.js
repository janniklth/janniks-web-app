console.log('register.js loaded');

// get the elements
const registerForm = document.getElementById('registerForm');
const registerFirstName = document.getElementById('registerFirstName');
const registerLastName = document.getElementById('registerLastName');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');


// Get the recaptcha key from the server on load
function onRecaptchaLoad() {
    // get the reCAPTCHA Site Key from the server
    fetch('/recaptcha/get-recaptcha-key')
        .then(response => response.json())
        .then(data => {
            const recaptchaSiteKey = data.recaptchaSiteKey;

            // render the reCAPTCHA on the element with ID "recaptchaContainer"
            grecaptcha.render('recaptchaContainer', {
                sitekey: recaptchaSiteKey
            });
        })
        .catch(error => {
            console.error('Error getting the recaptcha site key:', error);
        });
}

registerForm.addEventListener('submit', function (e) {
    // prevent default form action from being carried out
    e.preventDefault();

    // get recaptcha token
    const recaptchaToken = grecaptcha.getResponse();

    // get data from the form
    const formData = {
        firstName: registerFirstName.value,
        lastName: registerLastName.value,
        email: registerEmail.value,
        password: registerPassword.value,
        recaptchaToken: recaptchaToken
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