var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/prehome', function(req, res, next) {
  res.render('prehome',{
    css: ["prehome"]
  });
});




// router.get('/home', function(req, res, next) {
//   res.render('home.hbs');
// });

module.exports = router;
