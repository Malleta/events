let express = require('express');
let router = express.Router();
let fs = require('fs');
let mysql = require('mysql');



let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'events'
});

function randomID(lenth) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < lenth; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


router.post('/form', function (req, res, next) {
    console.log(req.query.formData);
    res.send(200)
});

router.get('/index', function (req, res) {

    connection.query(`SELECT * FROM event`, function (error, rows, fields) {
        if (error) throw error;
        console.log(rows);
        res.json(rows);

    });
});

router.get('/profile', function (req, res) {

    connection.query(`SELECT * FROM users WHERE uEmail = '${req.session.user.uEmail}'`, function (error, rows, fields) {
        if (error) throw error;
        res.json(rows[0]);

    });
});

router.post('/login', function (req, res, next) {

    connection.query(`SELECT * FROM users WHERE uEmail = '${req.query.uEmail}'`, function (error, rows, fields) {
        if (error) {
            return
        }

        if (rows.length > 0) {
            if (rows[0].uPassword === req.query.uPassword) {

                delete rows[0].uPassword;
                req.session.user = rows[0];

                console.log('Login', req.session.user);

                res.json({msg: "Ok"});
            } else {
                res.json({msg: "Passwords do not match.."});
            }
        } else {
            res.json({msg: "Not vaild email adress."});
        }
    });

});

router.post('/register', function (req, res) {


    let conf = {
        uID: randomID(10),
        uFirstName: req.query.firstName,
        uLastName: req.query.lastName,
        uLocation: req.query.location,
        uEmail: req.query.email,
        uPassword: req.query.password
    };

    connection.query('INSERT INTO users SET ?;', conf, function (error, results, fields) {
        if (error) throw error;

        res.json({msg: "OK"});

    });


});

router.post('/adminPanelSend', function (req, res) {


    let event = {
        eId: randomID(10),
        eNaziv: req.query.eNaziv,
        eOpis: req.query.eOpis,
        eOcena: req.query.eOcena,
        eCena: req.query.eCena,
        eDatum: req.query.eDatum,
        eDatumDani: req.query.eDatumDani,
        eLokacija: req.query.eLokacija,
        lat: req.query.lat,
        lng: req.query.lng
    };

    console.log(event);

    connection.query('INSERT INTO event SET ?', event, function (error, results, fields) {
        if (error) throw error;

        res.json({msg: "OK"});

    });

});

router.get('/adminPanelDelete', function (req, res) {

    let tempVal = req.query.event;
    tempVal = JSON.parse(tempVal);

    connection.query(`DELETE FROM event WHERE eId = '${tempVal.eId}';`, function (error, results, fields) {
        if (error) throw error;

        res.json({msg: "OK"});

    });

});

router.get('/adminPanelDeleteUser', function (req, res) {

    let tempVal = req.query.conf;
    tempVal = JSON.parse(tempVal);

console.log('aaa', tempVal)
    connection.query(`DELETE FROM users WHERE uID = '${tempVal.uID}';`, function (error, results, fields) {
        if (error) throw error;

        res.json({msg: "OK"});

    });

});

router.get('/adminPanelUpdate', function (req, res) {
    let tempVal = req.query.event;
    tempVal = JSON.parse(tempVal);

    connection.query(`UPDATE event SET ? WHERE eId = '${tempVal.eId}';`, tempVal, function (error, results, fields) {
        if (error) throw error;

        res.json({msg: "OK"});

    });

});

router.get('/getEvent', function (req, res) {

    connection.query(`SELECT * FROM event WHERE eId = '${req.query.eId}'`, function (error, rows, fields) {
        if (error) throw error;
        res.json(rows[0]);
    });
});

router.get('/getUser', function (req, res) {

    connection.query(`SELECT * FROM users WHERE uID = '${req.query.uID}'`, function (error, rows, fields) {
        if (error) throw error;
        res.json(rows[0]);
    });
});

router.get('/getAllEvents', function (req, res) {

    connection.query(`SELECT * FROM event`, function (error, rows, fields) {
        if (error) throw error;
        res.json(rows);
    });
});

router.get('/getAllUsers', function (req, res) {

    connection.query(`SELECT * FROM users`, function (error, rows, fields) {
        if (error) throw error;
        res.json(rows);
    });
});

router.get('/checkSession', function (req, res) {
    if(!!req.session.user){
        connection.query(`SELECT * FROM users WHERE uID= '${req.session.user.uID}'`, function (error, rows, fields) {
            if (error) throw error;
            res.json(!!req.session.user);
            console.log(!!req.session.user)
        });
    }else{
        console.log(!!req.session.user)

        res.json(!!req.session.user);

    }

});

module.exports = router;
