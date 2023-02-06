const express = require('express'),
passport      = require('passport'),
middlewares   = require('../middleware'),
router        = express.Router();

router.get('/login', middlewares.isAuthorized, (req, res) => {
    res.render('login');
})

router.post('/login', middlewares.isAuthorized, passport.authenticate('local',
    {
       successRedirect : '/auth',
       failureRedirect : '/loginerr',
    }
))

router.get('/loginerr', middlewares.isAuthorized, (req, res) => {
    req.flash('error', 'Invalid username or password');
    res.redirect('/login');
})

router.get('/auth', (req, res) => {
    res.render('auth');
})

module.exports = router;
