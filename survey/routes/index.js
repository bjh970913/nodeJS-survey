var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://admin:admin@ds053764.mongolab.com:53764/hyohun';
// Use connect method to connect to the Server
var db;

MongoClient.connect(url, function(err, db_conn) {
  assert.equal(null, err);
  db = db_conn;
  console.log("Connected correctly to server");
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send("asd");
});

router.get('/logout', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send("asd");
});

router.get('/manage', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send("asd");
});

router.get('/create', function(req, res, next) {
  res.render('create', { title: 'Create your own survey page' });
});

router.post('/save', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  //console.log(req);
  res.send(req.body);
});

router.get('/stat/:a', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send(req.params.a);
});

router.get('/survey/:a', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send("asd");
});

router.get('/dbtest/:a', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  db.collection('data').findOne({_id:req.params.a}, function(err, doc) {
    res.send(doc);
    db.close();
  });
});

module.exports = router;
