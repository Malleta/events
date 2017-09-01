let express = require('express');
let router = express.Router();

router.get('/', function (req, res) {
    res.render('regPage', {title: 'Aktivacija', js: "activationPage", session: !!req.session.user});
});

module.exports = router;
