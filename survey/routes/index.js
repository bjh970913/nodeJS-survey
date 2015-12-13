var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var shortid = require('shortid');

var DB = require('./db.js')

var serviceUrl = "http://nodesurvey.herokuapp.com/";

//====================================================
//setting Mongodb

var url = 'mongodb://admin:admin@ds053764.mongolab.com:53764/hyohun';
var User, SurveyData, Survey_ans;

MongoClient.connect(url, function(err, db_conn) {
  assert.equal(null, err);
  User = db_conn.collection('User');
  SurveyData = db_conn.collection('Survey');
  Survey_ans = db_conn.collection('Ans');
  
  console.log("Connected correctly to server");
});


//====================================================
//cutom router middleware 
function check_auth(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send('<script>alert("로그인이 필요합니다.");location.href="/login";</script>');
}

//====================================================
//setting routes

router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) { res.redirect('/manage'); }
  res.render('index', { title: 'Express' });
});

router.get('/register', function(req, res){
  res.render('register');
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.send('<script>alert("로그아웃 성공");location.href="/";</script>');
});

router.get('/manage', check_auth, function(req, res, next) {
  SurveyData.find({user:req.user.username}, {title:1, url:1, ans:1}).toArray(function(err, docs){
    res.render('manage', {data:docs, url:serviceUrl});
  });
});

router.get('/admin', check_auth, function(req, res, next) {
  if(req.user.username == 'admin')
  {
    User.find({}).toArray(function(err, docs){
      res.render('admin', {data:docs});
    });  
  }
  else
  {
    res.send("관리자가 아닙니다.");
  }
  
});

router.get('/create', check_auth, function(req, res, next) {
  res.render('create', { title: '설문 제작' });
});

router.post('/save', check_auth, function(req, res, next) {
  var uurl = shortid.generate();
  SurveyData.insertOne({user:req.user.username, data:req.body, url:uurl, title:req.body.title, ans:0},
    function (err,result) {
      assert.equal(err, null);
      res.send('성공적으로 설문을 생성했습니다.<br><a href="'+serviceUrl+'/survey/'+uurl+'">LINK</a>링크를 통해 설문에 참여하도록 할 수 있습니다.');
  });
});

router.get('/stat/:a', check_auth, function(req, res, next) {
  //res.render('index', { title: 'Express' });
  SurveyData.findOne({url:req.params.a}, function(err,data){
    Survey_ans.find({url:req.params.a}).toArray(function(err,ans){
      assert.equal(null, err);
      
      data = JSON.stringify(data);
      
      for(var i=0;i<ans.length;i++){
        ans[i] = JSON.stringify(ans[i]);
      }
      
      res.render('stat', {meta: data, ans: ans});
    });  
  });
  
});

router.get('/survey/:url', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  SurveyData.findOne({url:req.params.url},function(err,data){
    assert.equal(null, err);
    res.render('survey', {data: JSON.stringify(data)});
  });
});

router.get('/del/:url', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  SurveyData.deleteMany({url:req.params.url}, function(err, data){
    assert.equal(null, err);
    Survey_ans.deleteMany({url:req.params.url}, function(err, data){
      assert.equal(null, err);
      res.send('<script>alert("삭제 성공");location.href="/manage";</script>');
    });
  });
});

router.post('/survey', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  Survey_ans.insertOne({data:req.body, url:req.body.url},
    function (err,result) {
      assert.equal(err, null);
      SurveyData.update({url:req.body.url}, { $inc: {ans:1}});
      res.send("응답해주셔서 감사합니다.");
  });
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
