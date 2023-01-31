const express = require('express'),
router        = express.Router();

router.get('/logout', (req, res) => {
    req.logout(() => {
        req.flash('success', 'You logged out');
        res.redirect('/login');
    });
})

module.exports = router;
