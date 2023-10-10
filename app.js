// define the express app
const express = require('express');
const app = express();

// import routes/index.js and path
const routes = require('./routes/index');
const path = require("path");

/// use routes and ...
app.use(express.static('public'));
app.use('/', routes);
app.use(express.static('views', { index: 'home.html' }));

// error handler
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Secret key is ${process.env.TEST_SECRET}`);
});