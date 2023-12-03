// Import express
const express = require('express');
const router = express.Router();

// Import axios
const axios = require('axios');

// Import process and load environment variables
const process = require('process');
const {checkAuth} = require("../middleware");
const {db, admin} = require("../firebase");
// ...


router.get('/fetchStockData', async (req, res) => {
    try {
        // check if all required query parameters are set
        if (!req.query.symbol || !req.query.fromDate || !req.query.toDate) {
            return res.status(400).send('Missing Query Parameters');
        }

        const stockSymbol = req.query.symbol
        const fromDate = req.query.fromDate
        const toDate = req.query.toDate

        // log query parameters
        console.log('Symbol:', stockSymbol);
        console.log('From Date:', fromDate);
        console.log('To Date:', toDate);

        // create url
        const apiUrl = `https://financialmodelingprep.com/api/v3/historical-price-full/${stockSymbol}?apikey=${process.env.FMP_API_KEY}&from=${fromDate}&to=${toDate}`;

        // configure request
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        // send request
        const response = await fetch(apiUrl, requestOptions);
        const result = await response.json();



        // filter data
        const filteredData = result.historical.map(entry => ({
            date: entry.date,
            close: entry.close
        }));

        // log result
        console.log(filteredData);

        // send response to client
        res.json(filteredData);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/watchlist/get', checkAuth, async (req, res) => {
    const uid = req.session.user;

    console.log("User ID:", uid);

    const watchlistRef = db.collection('watchlists').doc(uid);
    const watchlistDoc = await watchlistRef.get();

    if (!watchlistDoc.exists) {
        return res.status(404).send("User not found.");
    }

    console.log("Data:");
    console.log(watchlistDoc.data());

    res.status(200).json(watchlistDoc.data());
});

router.post('/watchlist/add', checkAuth, async (req, res) => {
    const uid = req.session.user;
    const stockSymbol = req.body.stockSymbol;  // Zum Beispiel: 'AAPL' für Apple

    if (!stockSymbol) {
        return res.status(400).send("Stock symbol is required.");
    }

    const userRef = db.collection('users').doc(uid);

    // Add the stock symbol to the user's watchlist
    await userRef.update({
        watchlist: admin.firestore.FieldValue.arrayUnion(stockSymbol)
    });

    res.status(200).send("Added to watchlist.");
});

router.post('/watchlist/remove', checkAuth, async (req, res) => {
    const uid = req.session.user;
    const stockSymbol = req.body.stockSymbol;

    console.log("Stock symbol to remove:", stockSymbol);

    if (!stockSymbol) {
        return res.status(400).send("Stock symbol is required.");
    }

    const userRef = db.collection('watchlists').doc(uid);

    // Remove the stock symbol from the user's watchlist
    await userRef.update({
        stocks: admin.firestore.FieldValue.arrayRemove(stockSymbol)
    });

    res.status(200).send("Removed from watchlist.");
});


module.exports = router;