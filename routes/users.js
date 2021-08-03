var express = require('express');
const { isValidObjectId } = require('mongoose');
var router = express.Router();
const Pet = require("../models/Pet")

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/home', (req,res,next) => {
  Pet.find({owner: {$ne: req.session.currentUser}})
  .then((myPetsData) => {
    res.render('home.hbs', {
      pet: myPetsData
    })
  })
  .catch(error => next(error))
})

module.exports = router;
