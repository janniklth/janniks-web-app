// This file contains the routes for the application
const express = require('express');
const path = require('path');
const axios = require('axios');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'home.html'));
});

router.get('/weather', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'weather.html'));
});

router.get('/news', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'news.html'));
});

router.get('/stocks', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'stocks.html'));
});

router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'about.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'register.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});


router.get('/wikisearch', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'wikisearch.html'));
});

router.get('/searchwiki', async (req, res) => {
    const searchTerm = req.query.q;
    const count = req.query.count || 4; // Default to 4 if not specified

    console.log("Search term:", searchTerm);
    console.log("Result count:", count);

    if (!searchTerm) {
        return res.status(400).send({ error: 'Search term is required.' });
    }

    const baseURL = "https://de.wikipedia.org/w/api.php";
    const params = {
        action: 'query',
        generator: 'prefixsearch',
        gpslimit: count,
        format: 'json',
        prop: 'extracts|description',
        exintro: 1,
        explaintext: 1,
        exsentences: 3,
        gpssearch: searchTerm
    };

    try {
        const response = await axios.get(baseURL, { params });
        res.json(response.data);
    } catch (error) {
        console.error("Error while calling Wikipedia API:", error);
        res.status(500).send({ error: 'Failed to fetch data.' });
    }
});

router.get('/fetchStockData', async (req, res) => {
    const searchTerm = req.query.symbol;

    const params = {
        function: 'TIME_SERIES_DAILY',
        symbol: searchTerm,
        apikey: process.env.ALPHA_VANTAGE_API_KEY || "P9F0L5E1ZTC2UQ6W"
    };

    try {
        const response = await axios.get("https://www.alphavantage.co/query?", { params });
        console.log(response.data);
        res.json(response.data);
    } catch (error) {
        console.error("Error while calling AlphaVantage API:", error);
        res.status(500).send({ error: 'Failed to fetch data.' });
    }
});

module.exports = router;