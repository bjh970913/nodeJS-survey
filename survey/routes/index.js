var express = require('express');
var router = express.Router();



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
  //res.render('index', { title: 'Express' });
  res.send("asd");
});

router.get('/stat/:a', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send(req.params.a);
});

router.get('/survey/:a', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send(a);
});

router.get('/dbtest/:a', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send(a);
});

module.exports = router;
