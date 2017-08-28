/**
 * Created by malet on 16-Jul-17.
 */
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('adminPanel', {title: 'Admin Panel', js: "adminPanelPage"});
});


module.exports = router;