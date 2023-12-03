console.log("stocks.js loaded");

// get elements
const searchButton = document.getElementById('searchStockButton');
const timePeriodSelect = document.getElementById('timePeriodSelect');
const searchTermInput = document.getElementById('searchStockTerm');
const alertContainer = document.getElementById('alertContainer');
const watchlistContainer = document.getElementById('watchlistContainer');
const addToWatchlistButton = document.getElementById('addToWatchlistButton');

// define some vars
let companyName;
let lastSuccessfulSearchTerm;

// JS
var chart = JSC.chart('chartContainer', {
    debug: true,
    type: 'line',
    legend_visible: false,
    defaultPoint_marker_type: 'none',
    xAxis_crosshair_enabled: true,
    yAxis_formatString: 'c',
    series: []
});

// add event listener
searchButton.addEventListener('click', function () {
    const searchTerm = searchTermInput.value;

    if (searchTerm === '') {
        // Display an alert if the search term is empty
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
        // Fetch the data and replace the chart
        fetchStockDataAndReplaceChart(searchTerm);
        fetchCompanyData(searchTerm);

        // Show the cards
        document.getElementById('actualCourseCard').classList.remove('d-none');
        document.getElementById('generalInfoCard').classList.remove('d-none');
        document.getElementById('chartCard').classList.remove('d-none');

        // Show the add to watchlist button and add search term (upper case)
        addToWatchlistButton.classList.remove('d-none');
        addToWatchlistButton.innerHTML = "Add " + searchTerm.toUpperCase() + " to watchlist";
        lastSuccessfulSearchTerm = searchTerm;

        // clear alert container
        alertContainer.innerHTML = '';
    }
});

// add event listener
addToWatchlistButton.addEventListener('click', function () {
    // add stock to watchlist
    fetch("/stocks/watchlist/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            stockSymbol: lastSuccessfulSearchTerm.toUpperCase(),
            companyName: companyName
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Server error: ' + response.statusText);
            }

            // Create a new stock element and add it to the watchlist
            const stockElement = createStockElement(lastSuccessfulSearchTerm.toUpperCase(), companyName);
            watchlistContainer.appendChild(stockElement);
        })
        .catch(error => {
            // clear alert container
            alertContainer.innerHTML = '';

            // show error message
            alertContainer.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    Error while adding stock to watchlist: ${error.message}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span> 
                    </button>
                </div>`;

            const closeButton = document.querySelector('#alertContainer .close');
            closeButton.addEventListener('click', function () {
                alertContainer.innerHTML = '';
            });

            // Throw error
            console.error("Error while adding stock to watchlist:", error);
            throw new Error("Error while adding stock to watchlist:", error);
        })
});

// Function to fetch company data
function fetchCompanyData(stockSymbol) {
    // Fetch company data with symbol
    return fetch("/stocks/fetchCompanyData?symbol=" + stockSymbol)
        .then(response => {
            if (!response.ok) {
                throw new Error('Server error: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // get relevant data
            companyName = data[0].companyName;
            stockPrice = data[0].price;
            marketCap = data[0].mktCap;
            changes = data[0].changes;
            currency = data[0].currency;

            // add + if changes is positive
            if (changes > 0) {
                changes = "+" + changes;
            }

            // calculate absolute percentage change
            percentage_change = Math.abs(changes) / stockPrice * 100;

            // get actual time and update last updated
            const today = new Date();
            const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            document.getElementById('lastUpdated').innerHTML = "Last updated: " + time;

            // display data
            document.getElementById('companyName').innerHTML = companyName;
            document.getElementById('stockPrice').innerHTML = stockPrice + " " + currency;
            document.getElementById('marketCap').innerHTML = formatCompactNumber(marketCap) + " " + currency;
            document.getElementById('stockChange').innerHTML = changes + " " + currency + " (" + percentage_change.toFixed(2) + "%)";
        })
        .catch(error => {
            // Clear watchlist container and show error message
            alertContainer.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    Error while fetching company data: ${error.message}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span> 
                    </button>
                </div>`;

            const closeButton = document.querySelector('#alertContainer .close');
            closeButton.addEventListener('click', function () {
                alertContainer.innerHTML = '';
            });

            // Throw error
            console.error("Error while fetching company data:", error);
            throw new Error("Error while fetching company data:", error);
        });
}

// Function to fetch stock data
function fetchStockData(stockSymbol) {
    // Get the current date in the format YYYY-MM-DD (fromDate)
    const today = new Date();
    const toDate = today.toISOString().split('T')[0];

    // Get toDate from timePeriodSelect
    let fromDate;
    if (timePeriodSelect.value == "1m") {
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

    // Fetch stock data with symbol, fromDate, toDate
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
            // Clear watchlist container and show error message
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

            // Throw error
            console.error("Error while fetching stock data:", error);
            throw new Error("Error while fetching stock data:", error);
        });
}

// Function to fetch stock data and replace the chart
function fetchStockDataAndReplaceChart(stockSymbol) {
    // Call the fetchStockData function
    fetchStockData(stockSymbol)
        .then(stockData => {
            // Extract date and price from the received data
            const dataPoints = stockData.map(item => ({x: new Date(item.date), y: item.close}));

            // update general stock data
            document.getElementById('openPrice').innerHTML = stockData[0].open + " USD";
            document.getElementById('highPrice').innerHTML = stockData[0].high + " USD";
            document.getElementById('lowPrice').innerHTML = stockData[0].low + " USD";

            // Destroy the existing chart instance
            chart.destroy();

            // Create a new chart instance
            chart = JSC.chart('chartContainer', {
                debug: true,
                type: 'line',
                legend_visible: false,
                defaultPoint_marker_type: 'none',
                xAxis_crosshair_enabled: true,
                yAxis_formatString: 'c',
                series: [{
                    name: stockSymbol,
                    points: dataPoints
                }]
            });
        })
        .catch(error => {
            // Handle error
            console.error("Error while fetching stock data:", error);
        });
}


function addToWatchlist(stock) {
    // Create a new stock element and add it to the watchlist
    const stockElement = createStockElement(stock.symbol, stock.companyName);
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
            if (error.message === "Server error: Unauthorized") {
                // clear watchlist container and show error message
                watchlistContainer.innerHTML = `
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        Please login to see your watchlist.
                    </div>`;
                return;
            } else {
                // clear watchlist container and show error message
                watchlistContainer.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        Error while fetching watchlist: ${error.message}
                    </div>`;
            }

            // throw error
            console.error("Error while fetching watchlist:", error);
            throw new Error("Error while fetching watchlist:", error);
        });
}

function formatCompactNumber(number) {
    if (number < 1000) {
        return number;
    } else if (number >= 1000 && number < 1_000_000) {
        return (number / 1000).toFixed(1) + "K";
    } else if (number >= 1_000_000 && number < 1_000_000_000) {
        return (number / 1_000_000).toFixed(1) + "M";
    } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
        return (number / 1_000_000_000).toFixed(1) + "B";
    } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000) {
        return (number / 1_000_000_000_000).toFixed(1) + "T";
    }
}

// Fetch the watchlist when the page is loaded
window.addEventListener("load", fetchWatchlist);
