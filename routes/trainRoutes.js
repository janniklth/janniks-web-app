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
}).catch((error) => {
    console.error('Fehler beim Importieren des Moduls:', error);
});

router.get('/getTimetable', async (req, res) => {
    const stationName = req.query.stationName;
    const date = req.query.date;
    const time = req.query.time;

    console.log("Station name:", stationName);
    console.log("Date:", date);
    console.log("Time:", time);

    if (!stationName) {
        return res.status(400).send({ error: 'Station name is required.' });
    }

    if (!date) {
        return res.status(400).send({ error: 'Date is required.' });
    }

    const stationId = await db_trainstations.findIdForName(stationName);
    if (!stationId) {
        return res.status(400).send({ error: 'Invalid station name.' });
    }

    res.status(200).send({ stationId: stationId });
});

module.exports = router;