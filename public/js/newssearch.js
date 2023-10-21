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

    fetch('https://newsdata.io/api/1/news?apikey=pub_31553ab2665007bf05534e1fbb1862b1b6012&q=' + searchTerm + '&country=de')
        .then(response => {
            if (!response.ok) {
                throw new Error('Server error: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);


            const rowDiv = document.createElement('div');
            rowDiv.className = 'row';
            resultsDiv.appendChild(rowDiv);

            data.results.forEach(article => {
                // Erstellen Sie eine Bootstrap-Spalte für jeden Artikel
                const colDiv = document.createElement('div');
                colDiv.className = 'col-lg-6';

                // Erstellen Sie eine Bootstrap-Karte für jeden Artikel innerhalb der Spalte
                const card = document.createElement('div');
                card.className = 'card mb-4';

                // image
                const image = document.createElement('img');
                image.src = article.image_url || 'https://via.placeholder.com/300';
                image.alt = article.title;
                image.className = 'card-img-top';
                card.appendChild(image);

                // card body (title, description, link)
                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';

                const title = document.createElement('h5');
                title.className = 'card-title font-weight-bold';
                title.textContent = article.title;
                cardBody.appendChild(title);

                const description = document.createElement('p');
                description.className = 'card-text';
                description.textContent = article.description;
                cardBody.appendChild(description);

                const readMoreLink = document.createElement('a');
                readMoreLink.href = article.link;
                readMoreLink.target = '_blank';
                readMoreLink.textContent = 'read more';
                cardBody.appendChild(readMoreLink);

                card.appendChild(cardBody);
                colDiv.appendChild(card);
                rowDiv.appendChild(colDiv); // Fügen Sie die Spalte zur Reihe hinzu
            });

        })
        .catch(error => {
            console.error("Error while calling our server proxy:", error);
            alert("Ein Fehler ist aufgetreten: " + error.message);
        });
});
