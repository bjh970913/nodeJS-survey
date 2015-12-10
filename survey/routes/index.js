var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

//====================================================
//setting Mongodb

var url = 'mongodb://admin:admin@ds053764.mongolab.com:53764/hyohun';
var User, SurveyData;

MongoClient.connect(url, function(err, db_conn) {
  assert.equal(null, err);
  User = db_conn.collection('User');
  SurveyData = db_conn.collection('Survey');
  
  console.log("Connected correctly to server");
});


//====================================================
//cutom router middleware 
function check_auth(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send('<script>alert("Please sign in!");location.href="/signin";</script>');
}

//====================================================
//setting routes

router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) { res.redirect('/manage'); }
  res.render('index', { title: 'Express' });
});

router.get('/regiter', function(req, res){
  res.render('regiter');
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/logout', function(req, res, next) {
  var name = req.user.username;
  console.log("LOGGIN OUT " + req.user.username)
  req.logout();
  res.send('<script>alert("Logged out success!");location.href="/";</script>');
});

router.get('/manage', check_auth, function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send("manage page");
});

router.get('/create', check_auth, function(req, res, next) {
  res.render('create', { title: 'Create your own survey page' });
});

router.post('/save', check_auth, function(req, res, next) {
  //res.render('index', { title: 'Express' });
  //console.log(req);
  res.send(req.body);
});

router.get('/stat/:a', check_auth, function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send(req.params.a);
});

router.get('/survey/:a', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send("asd");
});

router.get('/dbtest/:a', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  SurveyData.findOne({_id:req.params.a}, function(err, doc) {
    console.log(doc);
    console.log(SurveyData);
    console.log(User);
    res.send(doc);
  });
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/manage',
                                   failureRedirect: '/login#fail',
                                   failureFlash: true })
);

router.post('/local-reg', passport.authenticate('local-signup', {
  successRedirect: '/manage',
  failureRedirect: '/signin#fail'
  })
);

//====================================================
//setting passport

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password != password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.use('local-signup', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    
    User.insertOne({"username":username, "password":password}, function (err,user) {
      if (user) {
        done(null, user, { message: 'Register success!' });
      }
      if (!user) {
        done(null, user, { message: 'Already exsisting username' });
      }
    });
  }
));

module.exports = router;
