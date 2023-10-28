// middleware.js

function checkAuth(req, res, next) {
    if (!req.session.user) {
        // res.redirect('/login');
        res.status(401).send('Unauthorized');
    } else {
        next();
    }
}

module.exports = {
    checkAuth
};
