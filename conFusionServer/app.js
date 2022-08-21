var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

var app = express();

app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-qwertyuiop'));

app.use(session({
  name: 'session-id',
  secret: '12345-qwertyuiop',
  resave: false,
  saveUninitialized: false,
  store: new FileStore(),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 60
    // or
    // maxAge: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  }
}))

function auth(req, res, next) {
  console.log('req.session:', req.session)

  if (!req.session.user) {
    let authHeader = req.headers.authorization;
    console.log(authHeader);

    if (!authHeader) {
      res.setHeader('WWW-Authenticate', 'Basic');
      let error = new Error('You are not authenticated!');
      error.status = 401;
      next(error);
      return;
    }

    let auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    let user = auth[0];
    let pass = auth[1];

    if (user === 'admin' && pass === 'admin') {
      // res.cookie('user', 'admin', {
      //   signed : true
      // });
      req.session.user = 'admin';
      next();
    } else {
      res.setHeader('WWW-Authenticate', 'Basic');
      let error = new Error('You are not authenticated!');
      error.status = 401;
      next(error);
    }
  } else {
    if (req.session.user === 'admin') {
      next();
    } else {
      let error = new Error('You are not authenticated!');
      error.setHeader('WWW-Authenticate', 'Basic');
      error.status = 401;
      next(error);
    }
  }
}

app.use(auth);

const url = 'mongodb://localhost:27017/conFusion';

mongoose.connect(url).then(() => {
  console.log('Successfully connected to the database');
}).catch(err => {
  console.log(err.message);
})

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
