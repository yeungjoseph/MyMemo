var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');

const db = require('./models/index');
const Users = db['User'];

var index = require('./routes/index');
var users = require('./routes/auth');

var app = express();

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

// Session handling
app.use(session({
  cookieName: 'session', // Names the request object req.session
  secret: 'xqKBPWdJvjbC9zRi3m6T',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    const select = 'SELECT * FROM "Users" WHERE email = ?';

    return db.sequelize
      .query(select, { 
        replacements: [req.session.user.email], 
        model: Users,
      })
      .then((response) => {
        if (response[0] !== undefined)
        {
          req.session.user = response[0];
          req.user = response[0];
          delete req.user.password;
          res.locals.user = response[0];
        }
        next();
      })
      .catch((error) => {
          console.log(error);
          next();
      });

  }
  next();
});

app.use('/', users);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
