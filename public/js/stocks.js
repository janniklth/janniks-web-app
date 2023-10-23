console.log("stocks.js loaded");

// get elements
const searchButton = document.getElementById('searchStockButton');
const searchTermInput = document.getElementById('searchStockTerm');
const alertContainer = document.getElementById('alertContainer');


// add event listener
searchButton.addEventListener('click', function () {
    const searchTerm = searchTermInput.value;

    if (searchTermInput === '') {
        alertContainer.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                Search term is required.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span> 
                </button>
            </div>
        `;
        const closeButton = document.querySelector('#alertContainer .close');
        closeButton.addEventListener('click', function () {
            alertContainer.innerHTML = '';
        });
    } else {
        // fetch the data
        fetch("/fetchStockData?symbol=" + searchTerm)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Server error: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
            });
    }
});