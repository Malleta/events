let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let sessions = require("client-sessions");

let api = require('./routes/api');
let index = require('./routes/index');
let login = require('./routes/login');
let register = require('./routes/register');
let profile = require('./routes/profile');
let event = require('./routes/event');
let reg = require('./routes/regRoute');


let adminPanel = require('./routes/adminPanel');
let adminEventAdd = require('./routes/adminEventAdd');
let adminEventDelete = require('./routes/adminEventDelete');
let adminEventModify = require('./routes/adminEventModify');
let adminUserDelete = require('./routes/adminUser');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessions({
    cookieName: 'session', // cookie name dictates the key name added to the request object
    secret: 'hzhuagYashebsnmBxbxhs!/?/?-67auuwydvan', // should be a large unguessable string
    duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
    activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));

let checkSession = function (req, res, next) {
    !!req.session.user ? res.redirect('/') : next();
};

let checkSessionNot = function (req, res, next) {
    !!req.session.user ? next() : res.redirect('/');
};


app.use('/', index);
app.use('/api', api);
app.use('/register', checkSession,  register);
app.use('/login', checkSession, login);
app.use('/adminPanel', adminPanel);
app.use('/profile', checkSessionNot, profile);

app.use('/event', event);
app.use('/reg', reg);

app.use('/adminEventAdd', adminEventAdd);
app.use('/adminEventDelete', adminEventDelete);
app.use('/adminEventModify', adminEventModify);
app.use('/adminUser', adminUserDelete);


app.use('/logout', function (req, res) {
    delete req.session.user;
    res.redirect('/')
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
