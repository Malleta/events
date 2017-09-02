/**
 * Created by malet on 16-Jul-17.
 */
var express = require('express');
var router = express.Router();
let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'events'
});


router.get('/', function (req, res) {


    connection.query(`SELECT * FROM users WHERE uID = '${req.session.user.uID}'`, function (error, rows, fields) {
        if (error) throw error;
        rows[0].uStatus === 'Admin'
            ?     res.render('adminPanel', {title: 'Admin Panel', js: "adminPanelPage"})
            : res.redirect('/');
    });

});


module.exports = router;