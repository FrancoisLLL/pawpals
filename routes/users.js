var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/homepage', (req,res,next) => {
  Pet.find
  .then((myPetsData) => {
    res.render('home.hbs', {
      pet: myPetsData
    })
  })
  .catch(error => next(error))
})

module.exports = router;
