console.log("contact.js loaded")

recaptchaContainer = document.getElementById('recaptchaContainer');

// Get the recaptcha key from the server on load
document.addEventListener('DOMContentLoaded', async () => {
    fetch('/recaptcha/get-recaptcha-key')
        .then(response => response.json())
        .then(data => {

            recaptchaContainer.dataset.sitekey = data.recaptchaSiteKey;
            console.log("recaptchaContainer.dataset.sitekey", recaptchaContainer.dataset.sitekey)

        })
        .catch(error => {
            console.error('Error fetching ReCAPTCHA Site Key:', error);
        });
});
