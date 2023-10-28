console.log("stocks.js loaded");

// get elements
const searchButton = document.getElementById('searchStockButton');
const searchTermInput = document.getElementById('searchStockTerm');
const alertContainer = document.getElementById('alertContainer');
const watchlistContainer = document.getElementById('watchlistContainer');





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


function addToWatchlist(stock) {
    // create new element for the stock
    const stockElement = document.createElement("div");
    stockElement.textContent = stock;

    // add the stock element to the watchlist container
    watchlistContainer.appendChild(stockElement);
}


function fetchWatchlist() {
    fetch("/watchlist")
        .then(response => {
            if (!response.ok) {
                throw new Error('Server error: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // check if stock is empty
            if (data.stocks.length === 0) {
                watchlistContainer.innerHTML = `
                    <div class="alert alert-info alert-dismissible fade show" role="alert">
                        Watchlist is empty.
                    </div>`;
                return;
            }
            else {
                data.stocks.forEach(stock => {
                    addToWatchlist(stock);
                    console.log(stock);
                });
            }
        })
        .catch(error => {
            // clear watchlist container and show error message
            watchlistContainer.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    Error while fetching watchlist: ${error.message}
                </div>`;

            // throw error
            console.error("Error while fetching watchlist:", error);
            throw new Error("Error while fetching watchlist:", error);
        });
}


// fetch the watchlist when the page is loaded
window.addEventListener("load", fetchWatchlist);