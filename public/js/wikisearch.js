const searchButton = document.getElementById('searchButton');
const searchTermInput = document.getElementById('searchTerm');
const resultCountInput = document.getElementById('resultCount');
const alertContainer = document.getElementById('alertContainer');
const resultsDiv = document.getElementById('results');

searchButton.addEventListener('click', function () {
    // Clear the results and alert container
    resultsDiv.innerHTML = '';
    alertContainer.innerHTML = '';

    // check if search term is empty and show alert if so
    if (searchTermInput.value === '') {
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
        return;
    }

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

            const rowDiv = document.createElement('div');
            rowDiv.className = 'row';
            resultsDiv.appendChild(rowDiv); // Add the row to the results

            const pages = data.query.pages;
            for (let pageId in pages) {
                const page = pages[pageId];

                // Create a Bootstrap column
                const colDiv = document.createElement('div');
                colDiv.className = 'col-lg-6';

                // Create a card for each result
                const card = document.createElement('div');
                card.className = 'card mb-4';

                // Card header for the title
                const cardHeader = document.createElement('h5');
                cardHeader.className = 'card-header font-weight-bold d-flex justify-content-between';

                // Title text
                const titleText = document.createElement('span');
                titleText.textContent = page.title;
                cardHeader.appendChild(titleText);

                // Speaker icon with click handler and hover event listener to play the audio
                const speakerLink = document.createElement('a'); // Create a link (or you can use button) element
                speakerLink.href = "#";  // Add a dummy href or the action you want to perform
                speakerLink.className = "text-muted"; // Bootstrap class to make the icon muted in appearance
                speakerLink.style.cursor = 'pointer'; // Make it apparent that it's clickable

                const speakerIcon = document.createElement('i');
                speakerIcon.className = 'fas fa-volume-up';
                speakerLink.appendChild(speakerIcon); // Append the icon to the link

                // Add a hover effect
                speakerLink.addEventListener('mouseover', function () {
                    speakerLink.classList.remove('text-muted');
                    speakerLink.classList.add('text-primary');  // Change color to Bootstrap's primary color on hover
                });
                speakerLink.addEventListener('mouseout', function () {
                    speakerLink.classList.remove('text-primary');
                    speakerLink.classList.add('text-muted');  // Revert back to muted color on mouse out
                });

                // add click handler to play audio
                speakerLink.addEventListener('click', function () {
                    console.log('Playing audio for ' + page.title);
                });

                cardHeader.appendChild(speakerLink);


                card.appendChild(cardHeader);

                // Card body for the description and extract
                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';

                // Description
                const description = document.createElement('p');
                description.className = 'card-title font-italic';
                description.textContent = page.description || 'No description available';
                cardBody.appendChild(description);

                // Extract with read more link
                const extract = document.createElement('p');
                extract.className = 'card-text';
                const extractText = page.extract || 'No extract available';
                const readMoreLink = `<a href="https://de.wikipedia.org/wiki/${encodeURIComponent(page.title)}" target="_blank">read more</a>`;
                extract.innerHTML = `${extractText}... ${readMoreLink}`;
                cardBody.appendChild(extract);

                card.appendChild(cardBody);
                colDiv.appendChild(card);
                rowDiv.appendChild(colDiv); // Add the card to the row
            }
        })
        .catch(error => {
            console.error("Error while calling our server proxy:", error);
            alert("Ein Fehler ist aufgetreten: " + error.message);
        });
});
