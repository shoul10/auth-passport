var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');

// Register user Form
router.get('/register', function(req, res){ 
  let newUser = new User(); 
  res.render('register', { title: 'Register', newUser: newUser});
});

// Register user Process
router.post('/register', function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password_confirmation = req.body.password_confirmation;
  const password = req.body.password;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password_confirmation', 'Password is required').notEmpty();
  req.checkBody('password', 'Passwords do not match').equals(req.body.password_confirmation);

  let errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors:errors
    });
  } else {
    // Match Username AND/OR Email
    let query = {$or: [{username: username}, {email: email}]};
    User.findOne(query, function(err, user){
      if(err) throw err; 
      let newUser = new User({
        name:name,
        email:email,
        username:username,
        password:password
      });     
      if(user){
        res.render('register', {message: req.flash('danger', 'Username AND/OR Email already exists !'), newUser: newUser});
      } else {            
        bcrypt.genSalt(10, function(err, salt){
          bcrypt.hash(newUser.password, salt, function(err, hash){
            if(err){
              console.log(err);
              return;
            }
            newUser.password = hash;
            newUser.save(function(err){
              if(err){
                console.log(err);
                return;
              } else {
                req.flash('success', 'The user : ' + newUser.name + ' is registered and can log in');
                res.redirect('/users/login');
              }
            });
          });
        });
      }       
    });    
  }
});

// Log in Form
router.get('/login', function(req, res){
  if (req.isAuthenticated()) {
    res.redirect('/secure');
  }
  res.render('login', { title: 'Log in' });
});

// Log in Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/secure',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

// Log out
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});


module.exports = router;
