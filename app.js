var createError = require('http-errors');
var cookie = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var express = require('express');
var path = require('path');

var indexRouter = require('./routes/index'); //for registration process
var formRouter = require('./routes/form'); //inside the website - post registration
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//Session
app.use(session({secret: 'my secret',
  resave: false,
  saveUninitialized: false}
))

//Cookies
app.use(cookie());

// I used the standard nodejs-express template and
// plugged my code (I deleted the /users route of the template)
app.use('/', indexRouter); // localhost:3000/abc/compute
app.use('/', formRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
