console.log('main.js loaded');

// get the navbar elements
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');


// check login status on page load
window.addEventListener('load', () => {


    fetch('/auth/check')
        .then(response => {
            console.log(response);
            if (!response.ok) {
                throw new Error('Server error: ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            console.log("Login status:", data);
            loginButton.classList.add('d-none');
            logoutButton.classList.remove('d-none');
        })
        .catch(error => {
            console.error("Error while checking login status:", error);
            loginButton.classList.remove('d-none');
            logoutButton.classList.add('d-none');
        });
});