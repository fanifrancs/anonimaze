const express = require('express'),
User          = require('../models/user'),
middlewares   = require('../middleware'),
router        = express.Router();

// dashboard
router.get('/messages/:user', middlewares.isLoggedIn, (req, res) => {
    if (req.user.username === req.params.user) {
        User.findOne({username: req.params.user}, (err, user) => {
            if (err || user === null) {
                res.render('error');
            } else {
                res.render('show', {user});
            }
        })
    } else {
        res.redirect('/messages/' + req.user.username);
    }
})

// renders message page
router.get('/:user/message', (req, res) => {
    User.findOne({username: req.params.user}, (err, user) => {
        if (err || user === null) {
            res.render('error');
        } else {
            res.render('send', {user});
        }
    })
})

// sends message
router.post('/:user/message', (req, res) => {
    User.findOne({username: req.params.user}, (err, user) => {
        if (err || user === null) {
            res.render('error');
        } else {
            user.messages.push(req.body.message);
            user.save((err, user) => {
                if (err) {
                    return res.render('error');
                }
            }); res.render('sent');
        }
    })
})

module.exports = router;
