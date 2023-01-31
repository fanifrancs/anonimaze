const express = require('express'),
middlewares   = require('../middleware'),
router        = express.Router();

router.get('/', middlewares.isAuthorized, (req, res) => {
    res.render('index');
})

module.exports = router;
