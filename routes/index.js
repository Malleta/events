/**
 * Created by malet on 16-Jul-17.
 */
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index', {title: 'Home', js: "indexPage", session: !!req.session.user});
});

module.exports = router;