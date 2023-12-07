// This file contains the routes for the application
const express = require('express');
const session = require('express-session');
const path = require('path');
const axios = require('axios');
const router = express.Router();
const bodyParser = require('body-parser');
const { verifyRecaptcha } = require('../recaptcha');




// firebase and auth
const {auth, admin, db} = require('../firebase');
const {checkAuth} = require('../middleware');
const {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} = require('firebase/auth');

// configure body-parser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.use(session({
    secret: '8fd419386961e0e25983a0328c16b1af2aa5b0210e4f0281e2f27aba41850e6697b3f1a8ec61aa865e1',
    resave: false,
    saveUninitialized: true
}));

const trainRoutes = require('./trainRoutes');
router.use('/train', trainRoutes);

const stocksRoutes = require('./stocksRoutes');
router.use('/stocks', stocksRoutes);

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

router.get('/train_dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'train_dashboard.html'));
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

// recaptcha routes
router.get('/recaptcha/get-recaptcha-key', async (req, res) => {
    const recaptchaSiteKey = process.env.RECAPTCHA_SITE_KEY;
    res.status(200).send({recaptchaSiteKey});
});


router.get('/searchwiki', async (req, res) => {
    const searchTerm = req.query.q;
    const count = req.query.count || 4; // Default to 4 if not specified

    console.log("Search term:", searchTerm);
    console.log("Result count:", count);

    if (!searchTerm) {
        return res.status(400).send({error: 'Search term is required.'});
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
        const response = await axios.get(baseURL, {params});
        res.json(response.data);
    } catch (error) {
        console.error("Error while calling Wikipedia API:", error);
        res.status(500).send({error: 'Failed to fetch data.'});
    }
});






router.post('/auth/register', async (req, res) => {

    const recaptchaToken = req.body.recaptchaToken;

    // check if recaptcha token is valid
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);

    if (!isRecaptchaValid) {
        return res.status(400).send('ReCAPTCHA validation failed');
    }


    createUserWithEmailAndPassword(auth, req.body.email, req.body.password)
        .then(async (userCredential) => {
            const user = userCredential.user;

            // add user data to database
            const userRef = db.collection('users').doc(user.uid);
            await userRef.set({
                firstName: req.body.firstName,
                lastName: req.body.lastName
            });

            // create watchlist for user
            const watchlistRef = db.collection('watchlists').doc(user.uid);
            await watchlistRef.set({
                stocks: []
            });

            // set session
            req.session.user = user.uid;

            // send response
            res.status(200).send('registration successful!');
        })
        .catch((error) => {
            console.log(error);
            res.status(400).send(error.code);
        });
});

// route to login user
router.post('/auth/login', async (req, res) => {
    console.log(req.body);
    signInWithEmailAndPassword(auth, req.body.email, req.body.password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);

            // set session
            req.session.user = user.uid;

            // send response
            res.send('User logged in! uid: ' + user.uid);
        });
});

// route to logout user
router.get('/auth/logout', async (req, res) => {
    req.session.destroy(err => {
        if(err) {
            return res.status(500).send('Server error');
        }
        res.clearCookie('connect.sid');  // TODO: 'session-name' sollte durch den Namen Ihres Session-Cookies ersetzt werden
        res.redirect('/login');
    });
});

// route to check if user is logged in
router.get('/auth/check', async (req, res) => {
    if (req.session.user) {
        res.send('User is logged in!');
    } else {
        res.status(401).send('User is not logged in!');
    }
});





module.exports = router;