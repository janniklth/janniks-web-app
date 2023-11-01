console.log("stocks.js loaded");

// get elements
const searchButton = document.getElementById('searchStockButton');
const searchTermInput = document.getElementById('searchStockTerm');
const alertContainer = document.getElementById('alertContainer');
const watchlistContainer = document.getElementById('watchlistContainer');

// define some vars
let companyName;




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
    // Fetch stock data, including company name
    fetchStockData(stock, "OVERVIEW")
        .then(data => {
            companyName = data.CompanyName;

            // Create a new stock element and add it to the watchlist
            const stockElement = createStockElement(stock, companyName);
            watchlistContainer.appendChild(stockElement);
        })
        .catch(error => {
            console.error("Error while fetching stock data:", error);
        });
}

// Create a stock element with symbol, company name, and details
function createStockElement(symbol, name) {
    // Create a new stock element
    const stockElement = document.createElement("div");
    stockElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

    // Create a container for stock details using Bootstrap Grid
    const detailsElement = document.createElement("div");
    detailsElement.classList.add("row", "w-100");

    // Create a container for symbol and name (col-6)
    const symbolNameContainer = document.createElement("div");
    symbolNameContainer.classList.add("col-6");

    // Create an element for the symbol (in größere Schrift und primäre Textfarbe)
    const symbolElement = document.createElement("div");
    symbolElement.classList.add("h5", "mb-0", "text-primary");
    symbolElement.textContent = symbol;

    // Create an element for the company name (darunter, in kleinerer Schrift und grau)
    const nameElement = document.createElement("div");
    nameElement.classList.add("small", "text-secondary");
    nameElement.textContent = name;

    // Create a container for the price and change (col-6, insgesamt rechts)
    const priceChangeContainer = document.createElement("div");
    priceChangeContainer.classList.add("col-6", "d-flex", "flex-column", "text-right");

    // Create an element for the stock price
    const priceElement = document.createElement("div");
    priceElement.classList.add("font-weight-bold");
    priceElement.textContent = "Current Price"; // Placeholder for stock price

    // Create an element for the stock change (positive oder negativ)
    const changeElement = document.createElement("div");
    changeElement.classList.add("font-weight-bold");
    changeElement.textContent = "+2.45%"; // Placeholder for stock change
    if (false) {
        changeElement.classList.add("text-danger");
    } else {
        changeElement.classList.add("text-success");
    }

    // Append elements to the stock element
    symbolNameContainer.appendChild(symbolElement);
    symbolNameContainer.appendChild(nameElement);
    priceChangeContainer.appendChild(priceElement);
    priceChangeContainer.appendChild(changeElement);
    detailsElement.appendChild(symbolNameContainer);
    detailsElement.appendChild(priceChangeContainer);
    stockElement.appendChild(detailsElement);

    return stockElement;
}



// function addToWatchlist(stock) {
//     // fetch stock data
//     fetchStockData(stock, "OVERVIEW")
//         .then(data => {
//             companyName = data.Name;
//             console.log(companyName);
//         })
//         .catch(error => {
//             console.error("Error while fetching stock data:", error);
//         });
//
//
//     // create a new stock element
//     const stockElement = document.createElement("div");
//     stockElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
//
//     // create a container for stock details using Bootstrap Grid
//     const detailsElement = document.createElement("div");
//     detailsElement.classList.add("row", "w-100");
//
//     // create a container for symbol and name (col-6)
//     const symbolNameContainer = document.createElement("div");
//     symbolNameContainer.classList.add("col-6");
//
//     // create an element for the symbol (in größere Schrift und primäre Textfarbe)
//     const symbolElement = document.createElement("div");
//     symbolElement.classList.add("h5", "mb-0", "text-primary");
//     symbolElement.textContent = stock;
//
//     // create an element for the company name (darunter, in kleinerer Schrift und grau)
//     const nameElement = document.createElement("div");
//     nameElement.classList.add("small", "text-secondary");
//     nameElement.textContent = companyName; // Placeholder for company name
//
//     // create a container for the price and change (col-6, insgesamt rechts)
//     const priceChangeContainer = document.createElement("div");
//     priceChangeContainer.classList.add("col-6", "d-flex", "flex-column", "text-right");
//
//     // create an element for the stock price
//     const priceElement = document.createElement("div");
//     priceElement.classList.add("font-weight-bold");
//     priceElement.textContent = "Current Price"; // Placeholder for stock price
//
//     // create an element for the stock change (positive oder negativ)
//     const changeElement = document.createElement("div");
//     changeElement.classList.add("font-weight-bold");
//     changeElement.textContent = "+2.45%"; // Placeholder for stock change
//     if (false) {
//         changeElement.classList.add("text-danger");
//     } else {
//         changeElement.classList.add("text-success");
//     }
//
//     // append elements to the stock element
//     symbolNameContainer.appendChild(symbolElement);
//     symbolNameContainer.appendChild(nameElement);
//     priceChangeContainer.appendChild(priceElement);
//     priceChangeContainer.appendChild(changeElement);
//     detailsElement.appendChild(symbolNameContainer);
//     detailsElement.appendChild(priceChangeContainer);
//     stockElement.appendChild(detailsElement);
//
//     // add the stock element to the watchlist container
//     const watchlistContainer = document.getElementById("watchlistContainer");
//     watchlistContainer.appendChild(stockElement);
// }



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

// function to fetch stock data to display in the watchlist
function fetchStockData(stockSymbol, functionName) {
    return new Promise((resolve, reject) => {
        const url = `/fetchStockData?symbol=${stockSymbol}&function=${functionName}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Server error: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}




// fetch the watchlist when the page is loaded
window.addEventListener("load", fetchWatchlist);