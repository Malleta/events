/**
 * Created by malet on 20-Jul-17.
 */
var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
    res.render('event', {title: 'Dogadjaji', js: "eventPage", session: !!req.session.user});
});


module.exports = router;