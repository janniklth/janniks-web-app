// trainroutes.js

// Import express
const express = require('express');
const router = express.Router();

// Import db_trainstations
const db_trainstations = require('../trainstation_reader');

// Import process and load environment variables
const process = require('process');
const db_client_id = process.env.DB_CLIENT_ID;
const db_client_secret = process.env.DB_CLIENT_SECRET;

// Import axios
const axios = require('axios');


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
    const date = new Date(req.query.date);
    const time = req.query.time;

    // format date in YYMMDD
    const formattedDate = date.toISOString().slice(2, 10).replace(/-/g, '');

    // format time in HH
    const timeParts = time.split(':');
    const formattedTime = `${timeParts[0]}`;

    console.log("Station name:", stationName);
    console.log("Date:", date, "  Formatted:", formattedDate);
    console.log("Time:", time, "  Formatted:", formattedTime);

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

    // fetch timetable from db api
    const url = `https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/plan/${stationId}/${formattedDate}/${formattedTime}`;
    const options = {
        headers: {
            'DB-Client-Id': db_client_id,
            'DB-Api-Key': db_client_secret,
            accept: 'application/xml'
        }
    };

    console.log("URL:", url);

    const response = await axios.get(url, options);
    const data = response.data;

    console.log(data);


    res.status(200).send({ stationId: stationId });
});

module.exports = router;