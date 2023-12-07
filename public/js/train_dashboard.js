console.log('train_dashboard.js loaded');


function createTrainCard(trainInfo) {
    // log the train info
    console.log("Creating card for train:");
    console.log(trainInfo);

    // Create the main card
    const card = document.createElement('div');
    card.className = 'card mb-3';

    // Create the body of the card
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body row'; // Added row class to arrange columns side by side

    // Left column
    const leftColumn = document.createElement('div');
    leftColumn.className = 'col-2 text-right'; // Align text to the right

    // Train info as heading
    const trainHeading = document.createElement('p');
    trainHeading.textContent = `${trainInfo.trainType || 'N/A'} ${trainInfo.trainNumber || 'N/A'}`;
    leftColumn.appendChild(trainHeading);

    // Departure time as heading
    const departureTime = document.createElement('h3');
    departureTime.textContent = trainInfo.departureTime ? `${formatDepartureTime(trainInfo.departureTime)}` : 'N/A';
    leftColumn.appendChild(departureTime);

    // Middle column
    const middleColumn = document.createElement('div');
    middleColumn.className = 'col-8';

    // Stops info as paragraph
    const stopsInfo = document.createElement('p');
    stopsInfo.textContent = trainInfo.intermediateStops ? `Via: ${trainInfo.intermediateStops.join(', ')}` : 'N/A';
    middleColumn.appendChild(stopsInfo);

    // Final destination as heading
    const destinationHeading = document.createElement('h3');
    destinationHeading.textContent = `${trainInfo.destination || 'N/A'}`;
    middleColumn.appendChild(destinationHeading);

    // Right column
    const rightColumn = document.createElement('div');
    rightColumn.className = 'col-2 d-flex align-items-center'; // Center vertically

    // Platform info as heading
    const platformHeading = document.createElement('h2');
    platformHeading.textContent = trainInfo.departurePlatform ? `${trainInfo.departurePlatform}` : 'N/A';
    rightColumn.appendChild(platformHeading);

    // Append columns to the body
    cardBody.appendChild(leftColumn);
    cardBody.appendChild(middleColumn);
    cardBody.appendChild(rightColumn);

    // Append the body to the card
    card.appendChild(cardBody);

    return card;
}

// Helper function to format departure time
function formatDepartureTime(rawTime) {
    const hours = rawTime.substring(6, 8);
    const minutes = rawTime.substring(8, 10);
    console.log("Hours:", hours, "Minutes:", minutes);
    return `${hours}:${minutes}`;
}


function extractTrainInfo(connection) {
    const trainInfo = {};

    // Extract train type and number
    const tl = connection.tl || [];
    if (tl.length > 0) {
        trainInfo.trainType = tl[0].$.c;
        trainInfo.trainNumber = tl[0].$.n;
    }

    // Extract destination and intermediate stops
    const dp = connection.dp || [];
    if (dp.length > 0) {
        const stops = dp[0].$.ppth.split('|');
        trainInfo.destination = stops[stops.length - 1];
        trainInfo.intermediateStops = stops.slice(0, -1);
    }

    // Extract departure platform, time, and short train number
    if (dp.length > 0) {
        const departure = dp[0].$;
        trainInfo.departurePlatform = departure.pp;
        trainInfo.departureTime = departure.pt;
        trainInfo.shortTrainNumber = departure.l;
    }

    // if train type is S or RE, set train number to short train number
    if (trainInfo.trainType === 'S' || trainInfo.trainType === 'RE') {
        trainInfo.trainNumber = trainInfo.shortTrainNumber;
    }

    // log the train info
    console.log(trainInfo);

    return trainInfo;
}


// get the elements
const searchStationInput = document.getElementById('searchStation');
const datalistElement = document.getElementById('searchOptionsStations');
const dateInput = document.getElementById('searchDate');
const hourInput = document.getElementById('searchHour');
const searchButton = document.getElementById('searchButton');
const alertContainer = document.getElementById('alertContainer');
const timetableContainer = document.getElementById('timetableContainer');

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
            console.error('Request failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// add event listener to the search button
searchButton.addEventListener('click', async () => {
    // Clear the results and alert container
    timetableContainer.innerHTML = '';
    alertContainer.innerHTML = '';

    // check if search term is empty and show alert if so
    if (searchStationInput.value === '') {
        alertContainer.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                Train station is required.
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
            const jsonData = await response.json();
            console.log(jsonData);

            const trains = jsonData.data;

            // Filter out trains without departure information
            const validTrains = trains.filter(train => train.dp);

            // Sort trains based on departure time
            validTrains.sort((a, b) => {
                const timeA = parseInt(a.dp[0].$.pt);
                const timeB = parseInt(b.dp[0].$.pt);
                return timeA - timeB;
            });

            // Create and append cards for each valid train
            validTrains.forEach(train => {
                const trainInfo = extractTrainInfo(train);
                const trainInfoCard = createTrainCard(trainInfo);
                timetableContainer.appendChild(trainInfoCard);
            });

        } else {
            // Extract error message from server response
            const errorResponse = await response.json();
            const errorMessage = errorResponse.error || 'Unknown error';

            // throw an error with the actual error message
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('Error:', error);

        // show alert
        alertContainer.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            ${error}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        `;

        const closeButton = document.querySelector('#alertContainer .close');
        closeButton.addEventListener('click', function () {
            alertContainer.innerHTML = '';
        });
    }

});
