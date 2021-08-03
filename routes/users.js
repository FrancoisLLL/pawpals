const express = require('express');
const router = express.Router();
const requireAuth = require("../middlewares/auth")
const User = require("../models/User");
const Pet = require("../models/Pet")

/* GET users listing. */
//router.get('/', requireAuth, function (req, res, next) {
//  res.render('home.hbs');
//});


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/home', (req,res,next) => {
  Pet.find()
  .then((myPetsData) => {
    res.render('home', {
      pet: myPetsData
    })
  })
  .catch(error => next(error))
});



router.get("/account/edit", (req, res, next) => {
	res.render("auth/editAccount");
});

//router.get('/account/edit', (req,res,next) => {
//  User.find()
//  .then((editmyAccount) => {
//    res.render('editAccount.hbs', {
//      User: editmyAccount
//    })
//  })
//  .catch(error => next(error))
//})

module.exports = router;
