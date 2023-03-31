const express = require('express'),
passport      = require('passport'),
User          = require('../models/user'),
middlewares   = require('../middleware'),
router        = express.Router();

router.get('/register', middlewares.isAuthorized, (req, res) => {
    res.render('register');
})

router.post('/register', middlewares.isAuthorized, (req, res) => {
    const { username, password } = req.body;
    const newUser = new User({username});
    User.register(newUser, password, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', `Hello ${req.user.username}. Welcome to Anonimaze`);
            res.redirect('/auth');
        })
    })
})

module.exports = router;
