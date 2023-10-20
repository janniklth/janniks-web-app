searchButton = document.getElementById('searchButton');
searchTermInput = document.getElementById('searchTerm');
resultCountInput = document.getElementById('resultCount');

searchButton.addEventListener('click', function() {
    const searchTerm = searchTermInput.value;
    const resultCount = resultCountInput.value || 4; // Default to 4 if not specified

    fetch('/searchwiki?q=' + searchTerm + '&count=' + resultCount) // Send the count to the server
        .then(response => {
            if (!response.ok) {
                throw new Error('Server error: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.query || !data.query.pages) {
                throw new Error('Unexpected response structure from server');
            }

            console.log(data);

            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = ''; // Clear any previous results

            const pages = data.query.pages;
            for (let pageId in pages) {
                const page = pages[pageId];

                // Create a Bootstrap card for each result
                const card = document.createElement('div');
                card.className = 'card mb-4';

                // Card header for the title
                const cardHeader = document.createElement('div');
                cardHeader.className = 'card-header';
                cardHeader.textContent = page.title;
                card.appendChild(cardHeader);

                // Card body for the description and extract
                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';

                const description = document.createElement('p');
                description.className = 'card-text';
                description.textContent = page.description || 'No description available';
                cardBody.appendChild(description);

                const extract = document.createElement('p');
                extract.className = 'card-text';
                extract.textContent = page.extract || 'No extract available';
                cardBody.appendChild(extract);

                card.appendChild(cardBody);
                resultsDiv.appendChild(card);
            }
        })
        .catch(error => {
            console.error("Error while calling our server proxy:", error);
            alert("Ein Fehler ist aufgetreten: " + error.message);
        });
});
