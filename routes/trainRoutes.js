// trainroutes.js

// Import express
const express = require('express');
const router = express.Router();

// Import db_trainstations
const db_trainstations = require('../trainstation_reader');


async function addNamesToResults(results) {
    for (const result of results) {
        try {
            const name = await db_trainstations.findNameForId(result.id);
            result.name = name;
        } catch (error) {
            console.error(error);
            result.name = 'Unbekannter Bahnhof';
        }
    }
}


import('db-stations-autocomplete').then((module) => {
    const { autocomplete } = module;
    router.get('/autocompleteStations', async (req, res) => {
        const searchTerm = req.query.q;

        // convert search term to string
        const term = searchTerm.toString();

        let searchResults = await autocomplete(term, results = 10, fuzzy = false, completion = true);
        addNamesToResults(searchResults)
            .then(() => {
                res.send(searchResults);
            });
    });

    router.get('/autocompleteStations/names', async (req, res) => {
        const searchTerm = req.query.q;

        // Rufe die Ergebnisse mit der autocomplete-Funktion ab
        const searchResultsNames = await autocomplete(searchTerm, results = 10, fuzzy = false, completion = true);

        addNamesToResults(searchResultsNames)
            .then(() => {
                const names = searchResultsNames.map((result) => result.name);
                console.log(names);
                res.send(names);
            });
    });

}).catch((error) => {
    console.error('Fehler beim Importieren des Moduls:', error);
});

module.exports = router;