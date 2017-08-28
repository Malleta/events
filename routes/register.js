var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
    res.render('register', {title: 'Register', js: "registrationPage", session: !!req.session.user});
});


module.exports = router;