var express = require('express');
const passport = require('passport');
var router = express.Router();
let User = require('../models/user');
let authenticate = require('../authenticate');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  let user = new User({
    username: req.body.username
  })

  User.register(user, req.body.password, async (err, user, next) => {
    try {
      // console.log('err:', err)
      // console.log('user:', user)
      if (err) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.json({
          error: err
        })
      } else {
        if (req.body.firstname) user.firstname = req.body.firstname
        if (req.body.lastname) user.lastname = req.body.lastname
        await user.save()
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json({
            success: true,
            message: 'Registration Successful!',
            user: {
              '_id': user._id, // using '_id', instead of _id
              'username': user.username,
              'admin': user.admin
            }
          })
        })
      }
    } catch (error) {
      let err = new Error('Error creating user')
      err.status = 500
      next(err)
    }
  })
})

// using passport
// there is a problem with login, sometimes login is not working, but the user is authenticated
// there is a relationship with the text file in the sessions folder, the text file is not being deleted
router.post('/login', passport.authenticate('local'), (req, res) => {
  let token = authenticate.getToken({
    '_id': req.user._id
  })
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.json({
    success: true,
    message: 'Login Successful!',
    token: token,
    user: {
      '_id': req.user._id,
      'username': req.user.username,
      'admin': req.user.admin
    }
  })
})

router.get('/logout', async (req, res, next) => {
  // console.log('session cek: ', req.session);

  if (req.session.passport?.user) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      message: 'You are logged out!'
    })
  } else {
    let err = new Error('You are not logged in!');
    err.status = 403;
    return next(err);
  }
})

module.exports = router;
