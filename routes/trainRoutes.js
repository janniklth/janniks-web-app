// trainroutes.js

// Import express
const express = require('express');
const router = express.Router();
const xml2js = require('xml2js');

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
    let stationId;
    let formattedDate;

    // format date in YYMMDD
    try {
        formattedDate = date.toISOString().slice(2, 10).replace(/-/g, '');
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Not a valid date' });
    }


    // format time in HH
    const timeParts = time.split(':');
    const formattedTime = `${timeParts[0]}`;

    console.log("Station name:", stationName);
    console.log("Date:", date, "  Formatted:", formattedDate);
    console.log("Time:", time, "  Formatted:", formattedTime);


    if (!stationName) {
        console.error('Station name is required.');
        return res.status(400).send({ error: 'Station name is required.' });
    }

    if (!date) {
        console.error('Date is required.');
        return res.status(400).send({ error: 'Date is required.' });
    }

    try {
        stationId = await db_trainstations.findIdForName(stationName);
        console.log("Station ID:", stationId);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Not a valid station name' });
    }

    try {

        // fetch timetable from db api
        const url = `https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/plan/${stationId}/${formattedDate}/${formattedTime}`;
        const options = {
            headers: {
                'DB-Client-Id': db_client_id,
                'DB-Api-Key': db_client_secret,
                accept: 'application/xml'
            }
        };

        const response = await axios.get(url, options);
        const xmlData = response.data;

        const parser = new xml2js.Parser();
        parser.parseString(xmlData, (err, jsonData) => {
            if (err) {
                console.error('Fehler beim Parsen des XML-Dokuments:', err);
                return res.status(500).send({ error: 'Error parsing XML document' });
            }

            const data = jsonData.timetable.s;
            res.status(200).send({ data });
        });

    }
    catch (error) {
        console.error('Fehler beim Abrufen des Fahrplans:', error);
        res.status(500).send({ error: 'Time/Date out of available range (range is around now +/- 15 hours)' });
    }
});

module.exports = router;