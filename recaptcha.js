// recaptcha.js

const fetch = require('node-fetch');

async function verifyRecaptcha(token) {
    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
    const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${token}`;

    const response = await fetch(recaptchaVerifyUrl, {
        method: 'POST',
    });

    const data = await response.json();
    return data.success;
}

module.exports = { verifyRecaptcha };