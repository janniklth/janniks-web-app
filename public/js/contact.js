console.log("contact.js loaded")

recaptchaContainer = document.getElementById('recaptchaContainer');

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

