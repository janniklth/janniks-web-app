// define process
const process = require('process');

// define dotenv
const dotenv = require('dotenv');
dotenv.config();

// define the express app
const express = require('express');
const app = express();

// initialize express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// import routes/index.js and path
const routes = require('./routes/index');
const path = require("path");


/// use routes and ... // TODO: edit comment
app.use(express.static('public'));
app.use('/', routes);
app.use(express.static('views', { index: 'home.html' }));


// error handler
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});




// define the port
const PORT = process.env.PORT || 6001;

// listen on the port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    console.log(`- - - - API Keys - - - -`);
    console.log(`OpenWeatherAPi: ${process.env.OPEN_WEATHER_API_KEY}`);
    console.log('DB Client ID:', process.env.DB_CLIENT_ID);
    console.log('DB Client Secret:', process.env.DB_CLIENT_SECRET);
});