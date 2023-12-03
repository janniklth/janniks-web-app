console.log("stocks.js loaded");

// get elements
const searchButton = document.getElementById('searchStockButton');
const timePeriodSelect = document.getElementById('timePeriodSelect');
const searchTermInput = document.getElementById('searchStockTerm');
const alertContainer = document.getElementById('alertContainer');
const watchlistContainer = document.getElementById('watchlistContainer');

// define some vars
let companyName;


// add event listener
searchButton.addEventListener('click', function () {
    const searchTerm = searchTermInput.value;

    if (searchTerm === '') {
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
        fetchStockData(searchTerm);
    }
});

function addToWatchlist(stock) {
    // Create a new stock element and add it to the watchlist
    const stockElement = createStockElement(stock, "companyName");
    watchlistContainer.appendChild(stockElement);

    // fetch stock data
    // ...
}

// Create a stock element with symbol, company name, and details
function createStockElement(symbol, name) {
    // Create a new stock element
    const stockElement = document.createElement("div");
    stockElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

    // Create a container for stock details using Bootstrap Grid
    const detailsElement = document.createElement("div");
    detailsElement.classList.add("row", "w-100");

    // Create a container for symbol and name (col-5)
    const symbolNameContainer = document.createElement("div");
    symbolNameContainer.classList.add("col-5");

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

    // Create a container for the delete icon (col-1)
    const deleteContainer = document.createElement("div");
    deleteContainer.classList.add("col-1", "text-right", "d-flex", "align-items-center");

    // Create a red cross icon using Font Awesome (as text content)
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-times", "fa-lg", "text-danger");

    // Set data-toggle and data-tooltip attributes for Bootstrap Tooltip
    deleteIcon.setAttribute("data-toggle", "tooltip");
    deleteIcon.setAttribute("data-tooltip", "tooltip");
    deleteIcon.setAttribute("title", "Remove from Watchlist");

    // Initialize Bootstrap Tooltip
    $(deleteIcon).tooltip();

    // Add event listener to the delete icon
    deleteIcon.addEventListener("click", function () {
        // hide the tooltip
        $(deleteIcon).tooltip('hide');

        // find the parent element (stockElement) and remove it from the watchlist
        const parentStockElement = deleteIcon.closest(".list-group-item");
        if (parentStockElement) {
            // Remove the stockElement from the watchlist
            parentStockElement.remove();
        }

        // Remove the stock from the watchlist in the database
        fetch("/stocks/watchlist/remove", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                stockSymbol: symbol
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Server error: ' + response.statusText);
                }
            })
            .catch(error => {
                console.error("Error while removing stock from watchlist:", error);
            });
    });

    // Append elements to the stock element
    symbolNameContainer.appendChild(symbolElement);
    symbolNameContainer.appendChild(nameElement);
    priceChangeContainer.appendChild(priceElement);
    priceChangeContainer.appendChild(changeElement);
    deleteContainer.appendChild(deleteIcon);
    detailsElement.appendChild(symbolNameContainer);
    detailsElement.appendChild(priceChangeContainer);
    detailsElement.appendChild(deleteContainer);
    stockElement.appendChild(detailsElement);

    return stockElement;
}


function fetchWatchlist() {
    fetch("/stocks/watchlist/get")
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
            } else {
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
function fetchStockData(stockSymbol) {

    // get actual date in format YYYY-MM-DD (fromDate)
    const today = new Date();
    const toDate = today.toISOString().split('T')[0];

    console.log(timePeriodSelect.value);

    // get toDate from timePeriodSelect
    let fromDate;
    if (timePeriodSelect.value == "1w") {
        const week = new Date();
        week.setDate(week.getDate() - 7);
        fromDate = week.toISOString().split('T')[0];
    } else if (timePeriodSelect.value == "1m") {
        const month = new Date();
        month.setMonth(month.getMonth() - 1);
        fromDate = month.toISOString().split('T')[0];
    } else if (timePeriodSelect.value == "3m") {
        const month = new Date();
        month.setMonth(month.getMonth() - 3);
        fromDate = month.toISOString().split('T')[0];
    } else if (timePeriodSelect.value == "6m") {
        const month = new Date();
        month.setMonth(month.getMonth() - 6);
        fromDate = month.toISOString().split('T')[0];
    } else if (timePeriodSelect.value == "1y") {
        const year = new Date();
        year.setFullYear(year.getFullYear() - 1);
        fromDate = year.toISOString().split('T')[0];
    } else {
        fromDate = "2023-10-01";
    }


    // fetch stock data with symbol, fromDate, toDate
    return fetch("/stocks/fetchStockData?symbol=" + stockSymbol + "&fromDate=" + fromDate + "&toDate=" + toDate)
        .then(response => {
            if (!response.ok) {
                throw new Error('Server error: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            // clear watchlist container and show error message
            alertContainer.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    Error while fetching stock data: ${error.message}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;

            const closeButton = document.querySelector('#alertContainer .close');
            closeButton.addEventListener('click', function () {
                alertContainer.innerHTML = '';
            });

            // throw error
            console.error("Error while fetching stock data:", error);
            throw new Error("Error while fetching stock data:", error);
        });
}


// JS
var chart = JSC.chart('chartContainer', {
    debug: true,
    type: 'line',
    legend_visible: false,
    defaultPoint_marker_type: 'none',
    xAxis_crosshair_enabled: true,
    yAxis_formatString: 'c',
    series: [
        {
            name: 'Purchases',
            points: [
                [new Date(2010, 1, 1), 28.15],
                [new Date(2010, 1, 2), 28.2],
                [new Date(2010, 1, 3), 28.37],
                [new Date(2010, 1, 4), 27.59],
                [new Date(2010, 1, 5), 27.76],
                [new Date(2010, 1, 8), 27.47],
                [new Date(2010, 1, 9), 27.75],
                [new Date(2010, 1, 10), 27.73],
                [new Date(2010, 1, 11), 27.86],
                [new Date(2010, 1, 12), 27.68],
                [new Date(2010, 1, 16), 28.22],
                [new Date(2010, 1, 17), 28.46],
                [new Date(2010, 1, 18), 28.84],
                [new Date(2010, 1, 19), 28.64],
                [new Date(2010, 1, 22), 28.6],
                [new Date(2010, 1, 23), 28.2],
                [new Date(2010, 1, 24), 28.5],
                [new Date(2010, 1, 25), 28.47],
                [new Date(2010, 1, 26), 28.54],
                [new Date(2010, 2, 1), 28.89],
                [new Date(2010, 2, 2), 28.33],
                [new Date(2010, 2, 3), 28.33],
                [new Date(2010, 2, 4), 28.5],
                [new Date(2010, 2, 5), 28.46],
                [new Date(2010, 2, 8), 28.5],
                [new Date(2010, 2, 9), 28.67],
                [new Date(2010, 2, 10), 28.84],
                [new Date(2010, 2, 11), 29.05],
                [new Date(2010, 2, 12), 29.14],
                [new Date(2010, 2, 15), 29.16],
                [new Date(2010, 2, 16), 29.24],
                [new Date(2010, 2, 17), 29.5],
                [new Date(2010, 2, 18), 29.48],
                [new Date(2010, 2, 19), 29.46],
                [new Date(2010, 2, 22), 29.47],
                [new Date(2010, 2, 23), 29.75],
                [new Date(2010, 2, 24), 29.52],
                [new Date(2010, 2, 25), 29.88],
                [new Date(2010, 2, 26), 29.53],
                [new Date(2010, 2, 29), 29.46],
                [new Date(2010, 2, 30), 29.64],
                [new Date(2010, 2, 31), 29.16],
                [new Date(2010, 3, 1), 29.03],
                [new Date(2010, 3, 5), 29.14],
                [new Date(2010, 3, 6), 29.19],
                [new Date(2010, 3, 7), 29.22],
                [new Date(2010, 3, 8), 29.79],
                [new Date(2010, 3, 9), 30.2],
                [new Date(2010, 3, 12), 30.18],
                [new Date(2010, 3, 13), 30.31],
                [new Date(2010, 3, 14), 30.68],
                [new Date(2010, 3, 15), 30.73],
                [new Date(2010, 3, 16), 30.53],
                [new Date(2010, 3, 19), 30.9],
                [new Date(2010, 3, 20), 31.22],
                [new Date(2010, 3, 21), 31.19],
                [new Date(2010, 3, 22), 31.25],
                [new Date(2010, 3, 23), 30.82],
                [new Date(2010, 3, 26), 30.97],
                [new Date(2010, 3, 27), 30.71],
                [new Date(2010, 3, 28), 30.77],
                [new Date(2010, 3, 29), 30.86],
                [new Date(2010, 3, 30), 30.4],
                [new Date(2010, 4, 3), 30.72],
                [new Date(2010, 4, 4), 29.99],
                [new Date(2010, 4, 5), 29.72],
                [new Date(2010, 4, 6), 28.85],
                [new Date(2010, 4, 7), 28.08],
                [new Date(2010, 4, 10), 28.81],
                [new Date(2010, 4, 11), 28.75],
                [new Date(2010, 4, 12), 29.31],
                [new Date(2010, 4, 13), 29.11],
                [new Date(2010, 4, 14), 28.8],
                [new Date(2010, 4, 17), 28.81],
                [new Date(2010, 4, 18), 28.6],
                [new Date(2010, 4, 19), 28.24],
                [new Date(2010, 4, 20), 27.11],
                [new Date(2010, 4, 21), 26.84],
                [new Date(2010, 4, 24), 26.27]
            ]
        }
    ]
});


// fetch the watchlist when the page is loaded
window.addEventListener("load", fetchWatchlist);