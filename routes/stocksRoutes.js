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
            open: entry.open,
            close: entry.close,
            high: entry.high,
            low: entry.low
        }));

        // reverse data
        filteredData.reverse();

        console.log('Data:', filteredData);

        // send response to client
        res.json(filteredData);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/fetchCompanyData', async (req, res) => {
    try {
        // check if all required query parameters are set
        if (!req.query.symbol) {
            return res.status(400).send('Missing Query Parameters');
        }

        const stockSymbol = req.query.symbol

        // create url
        const apiUrl = `https://financialmodelingprep.com/api/v3/profile/${stockSymbol}?apikey=${process.env.FMP_API_KEY}`;

        // configure request
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        // send request
        const response = await fetch(apiUrl, requestOptions);
        const result = await response.json();

        // send response to client
        res.json(result);

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
    const stockSymbol = req.body.stockSymbol;
    const companyName = req.body.companyName;

    console.log("Stock symbol to add:", stockSymbol);
    console.log("Company name to add:", companyName);

    if (!stockSymbol || !companyName) {
        return res.status(400).send("Stock symbol is required.");
    }

    const userRef = db.collection('watchlists').doc(uid);

    // Add the stock symbol to the user's watchlist (array of symbol and company name)
    await userRef.update({
        stocks: admin.firestore.FieldValue.arrayUnion({
            symbol: stockSymbol,
            companyName: companyName
        })
    });

    console.log("Added to watchlist.");

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

    // get all stocks from the user's watchlist
    const doc = await userRef.get();
    const currentStocks = doc.data().stocks || [];

    // remove the stock symbol from the user's watchlist
    const updatedStocks = currentStocks.filter(stock => stock.symbol !== stockSymbol);

    // push the updated watchlist to the database
    await userRef.update({
        stocks: updatedStocks
    });

    res.status(200).send("Removed from watchlist.");
});


module.exports = router;