console.log('train_dashboard.js loaded');

// get the elements
const searchStationInput = document.getElementById('searchStation');
const datalistElement = document.getElementById('searchOptionsStations');
const dateInput = document.getElementById('searchDate');
const hourInput = document.getElementById('searchHour');
const searchButton = document.getElementById('searchButton');
const alertContainer = document.getElementById('alertContainer');

// add actual date and time to the inputs
const now = new Date();
dateInput.value = now.toISOString().slice(0, 10);

// disable past dates in date input
dateInput.setAttribute('min', now.toISOString().slice(0, 10));

// add event listener to update the select options (stations) when the input changes
searchStationInput.addEventListener('input', async (event) => {
    const searchTerm = event.target.value;

    console.log("Search term:", searchTerm);

    // get results from server
    try {
        const response = await fetch(`/train/autocompleteStations?q=${searchTerm}`);
        if (response.ok) {
            const results = await response.json();

            // clear the datalist
            datalistElement.innerHTML = '';

            // add the results to the datalist
            results.forEach((result) => {
                const option = document.createElement('option');
                option.value = result.name;
                datalistElement.appendChild(option);
            });
        } else {
            console.error('Fehler beim Abrufen der Ergebnisse.');
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Ergebnisse:', error);
    }
});

// add event listener to the search button
searchButton.addEventListener('click', async () => {
// Clear the results and alert container
//     resultsDiv.innerHTML = '';
    alertContainer.innerHTML = '';

    // check if search term is empty and show alert if so
    if (searchStationInput.value === '') {
        alertContainer.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                Train station is requried.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `;

        const closeButton = document.querySelector('#alertContainer .close');
        closeButton.addEventListener('click', function () {
            alertContainer.innerHTML = '';
        });
        return;
    }

    // get time and date
    const date = dateInput.value;
    const hour = hourInput.value;
    console.log("Request: Station:", searchStationInput.value, "Date:", date, "Hour:", hour);

    // get results from server
    try {
        const response = await fetch(`/train/getTimetable?stationName=${searchStationInput.value}&date=${date}&time=${hour}`);
        if (response.ok) {
            const results = await response.json();
            console.log(results);
        } else {
            console.error('Fehler beim Abrufen der Ergebnisse.');
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Ergebnisse:', error);
    }
});

