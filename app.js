// define the express app
const express = require('express');
const app = express();

// import routes/index.js
const routes = require('./routes/index');

/// use routes and
app.use(express.static('public'));
app.use('/', routes);
app.use(express.static('views', { index: 'home.html' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});