// firebase.js

const admin = require('firebase-admin');
const firebase = require('firebase/app');
const firebaseAuth = require('firebase/auth');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const firebaseConfig = {
    apiKey: "AIzaSyAqWIM2GMtQSF2t8yqNm_iU7r-ia1mzYa8",
    authDomain: "janniks-web-app.firebaseapp.com",
    projectId: "janniks-web-app",
    storageBucket: "janniks-web-app.appspot.com",
    messagingSenderId: "904163460963",
    appId: "1:904163460963:web:438086816a5fee81c43556",
    measurementId: "G-LBWBKX0Y27"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);


const auth = firebaseAuth.getAuth(firebaseApp);
const db = admin.firestore();

module.exports = {
    auth,
    admin,
    db
};
