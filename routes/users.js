var express = require('express');
var router = express.Router();
const requireAuth = require("../middlewares/auth")

/* GET users listing. */
router.get('/', requireAuth, function (req, res, next) {
  res.render('home.hbs');
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
