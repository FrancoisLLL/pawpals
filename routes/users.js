var express = require('express');
var router = express.Router();
const Pet = require("../models/Pet")

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/', (req,res,next) => {
  Pet.find()
  .then((myPetsData) => {
    console.log("it works");
    res.render('home.hbs', {
      pet: myPetsData
    })
  })
  .catch(error => next(error))
})

module.exports = router;
