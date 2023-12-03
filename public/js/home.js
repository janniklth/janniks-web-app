

window.addEventListener('load', () => {

    // check login status on page load
    fetch('/auth/check')
        .then(response => {
            if (!response.ok) {
                throw new Error('Server error: ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            console.log("Login status:", data);

            // get name of the user
            // ...
        })
        .catch(error => {
            console.warn("Error while checking login status:", error);
        });
}