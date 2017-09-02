let express = require('express');
let router = express.Router();
let fs = require('fs');
let mysql = require('mysql');
let email = require('./../handlers/mail');



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
        if(rows[0].uActivation === '1'){
            if (rows.length > 0) {
                if (rows[0].uPassword === req.query.uPassword) {

                    delete rows[0].uPassword;
                    req.session.user = rows[0];

                    res.json({status: true, msg: "Ok"});
                } else {
                    res.json({status: false, msg: "Passwords do not match.."});
                }
            } else {
                res.json({status: false, msg: "Not vaild email adress."});
            }
        } else {
            res.json({status: false, msg: "Aktivirajte svoj nalog."});
        }
    });

});

router.post('/register', function (req, res) {


    let conf = {
        uID: randomID(10),
        uStatus: 'User',
        uFirstName: req.query.firstName,
        uLastName: req.query.lastName,
        uLocation: req.query.location,
        uEmail: req.query.email,
        uPassword: req.query.password,
        lat: req.query.lat,
        lng: req.query.lng
    };

    connection.query('INSERT INTO users SET ?;', conf, function (error, results, fields) {
        if (error) throw error;

        email.send({
            subject: 'Aktiviranje naloga',
            from: 'no-replay@events.rs',
            to: conf.uEmail,
            templateName: 'professorRegistration',
            templateVariables: {
                uID: conf.uID
            }
        });
        res.json({msg: "OK"});

    });


});

router.post('/activation', function (req, res) {
    console.log(req.query);
    connection.query(`UPDATE users SET uActivation = '1' WHERE uID = '${req.query.uID}';`, function (error, results, fields) {
        if (error) throw error;

        res.json({status: true, msg: "Aktivacija uspesna!"});

    });

});

router.post('/adminPanelSend', function (req, res) {


    let event = {
        eID: randomID(10),
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
    connection.query(`SELECT * FROM event WHERE eID = '${req.query.eID}'`, function (error, rows, fields) {
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

//
router.post('/commentSend', function (req, res) {


    let comment = {
        eID: req.query.eID,
        uID: req.session.user.uID,
        uFirstName: req.session.user.uFirstName,
        uComment: req.query.uComment,
    };


    connection.query('INSERT INTO comments SET ?', comment, function (error, results, fields) {
        if (error) throw error;
        res.json({status: true, msg: "Komentar postavljen"});
    });

});

router.get('/getComments', function (req, res) {

    connection.query(`SELECT * FROM comments WHERE eID = '${req.query.eID}'`, function (error, rows, fields) {
        if (error) throw error;
        res.json(rows);
    });
});

router.post('/uReviewSend', function (req, res) {

    let comment = {
        eID: req.query.eID,
        uID: req.session.user.uID,
        uReview: req.query.uReview,
    };

    console.log(comment)
    connection.query('INSERT INTO review SET ?', comment, function (error, results, fields) {
        if (error) throw error;
        res.json({status: true, msg: "Ocena postavljen"});
    });

});

router.get('/getReview', function (req, res) {

    connection.query(`SELECT uReview FROM review WHERE eID = '${req.query.eID}'`, function (error, rows, fields) {
        if (error) throw error;
        res.json(rows);
    });
});

router.get('/getReviewCheck', function (req, res) {

    connection.query(`SELECT * FROM review WHERE eID = '${req.query.eID}' AND uID = '${req.session.user.uID}'`, function (error, rows, fields) {
        if (error) throw error;
        res.json(rows);
    });
});

router.get('/getUserID', function (req, res) {

    connection.query(`SELECT * FROM users WHERE uID = '${req.session.user.uID}'`, function (error, rows, fields) {
        if (error) throw error;
        res.json(rows[0]);
    });
});




module.exports = router;
