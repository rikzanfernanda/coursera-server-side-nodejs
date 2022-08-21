var express = require('express');
var router = express.Router();
let User = require('../model/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', async (req, res, next) => {
  try {
    let user = await User.findOne({
      username: req.body.username
    })

    if (user) {
      let err = new Error('User already exists!');
      err.status = 403;
      return next(err);
    }

    let newUser = new User({
      username: req.body.username,
      password: req.body.password
    })

    let userSave = await newUser.save();

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      status: 'User registered successfully!',
      user: userSave
    });
  } catch (error) {
    return next(error)
  }
})

router.post('/login', async (req, res, next) => {
  console.log('login', req.session)

  if (!req.session.user) {
    let authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log('!authHeader')
      let err = new Error('You are not authenticated!');
      err.status = 403;
      return next(err);
    }

    try {
      let auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      let username = auth[0];
      let password = auth[1];

      let user = await User.findOne({
        username: username
      })

      console.log('user: ', user)

      if (user === null) {
        let err = new Error('User does not exist!');
        err.status = 403;
        return next(err);
      } else if (user.password !== password) {
        let err = new Error('Incorrect password!');
        err.status = 403;
        return next(err);
      } else if (user.username === username && user.password === password) {
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!');
      }

    } catch (error) {
      return next();
    }
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
})

router.get('/logout', async (req, res, next) => {
  console.log('session: ', req.session);

  if (req.session.user) {
    req.session.destroy();
    res.clearCookie('session-id');
    // res.redirect('/');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are logged out!');
  } else {
    let err = new Error('You are not logged in!');
    err.status = 403;
    return next(err);
  }
})

module.exports = router;
