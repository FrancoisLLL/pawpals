const express = require('express');
const router = express.Router();
const requireAuth = require("../middlewares/auth")
const User = require("../models/User");
const Pet = require("../models/Pet")


router.get('/home', (req, res, next) => {
  Pet.find({ owner: req.session.currentUser._id })
    .then((myPetsData) => {
      // console.log(myPetsData);
      delete req.session.currentPet;
      res.render('home', {
        pet: myPetsData
      })
    })
    .catch(error => next(error))
});


router.get("/account/edit", (req, res, next) => {
  res.render("auth/editAccount");
});


module.exports = router;
