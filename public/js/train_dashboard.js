console.log('train_dashboard.js loaded');

// get the elements
const inputElement = document.getElementById('input-datalist');
const datalistElement = document.getElementById('searchOptionsStations');


inputElement.addEventListener('input', async (event) => {
    const searchTerm = event.target.value;

    console.log("Search term:", searchTerm);

    // get results from server
    try {
        const response = await fetch(`/autocomplete?q=${searchTerm}`);
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
