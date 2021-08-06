const express = require('express');
const router = express.Router();
const requireAuth = require("../middlewares/auth")
const User = require("../models/User");
const Pet = require("../models/Pet")
const Playdate = require("../models/Playdate")
const ObjectId = require('mongoose').Types.ObjectId;
const { LoopDetected } = require('http-errors');
require("../routes/playdates")


router.get('/home', requireAuth, async (req, res, next) => {

  if(req.session.currentPet) { 
    delete req.session.currentPet;
  }

    const userPets = await Pet.find({
      owner: req.session.currentUser._id
    })

    // let petsConfirmedPlaydates = [];

    // for (let i = 0; i < userPets.length; i++) {
    //  const response =  Playdate.find({
    //     status: "confirmed",
    //     $or: [{
    //         receiverId: userPets[i]._id
    //     }, {
    //         senderId: userPets[i]._id
    //     }]
    //   })

    //   await petsConfirmedPlaydates.push(response);
    //   console.log(petsConfirmedPlaydates)
    // }

    res.render('home', {
      pet: userPets,
      css: ["home", "style"],
    })


router.post("/account/:id/edit", (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, req.body)
    .then((userDetails) => {
      (console.log("redirect"))
      res.redirect("/home");
    })

    .catch(e => console.log(e))

});


router.get("/account/:id/edit", (req, res, next) => {
  User.findById(req.params.id)
    .then((oneUser) => {
      res.render("auth/editAccount", {
        user: oneUser,
      });
    })
    .catch(e => console.log(e))

});


    // console.log(confirmedPlaydates)



  // } catch (error) {next(error)}

});

    
router.post("/account/:id/edit", (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, req.body)
    .then((userDetails) => {(console.log("redirect"))
      res.redirect("/home");
    })
    .catch(e => console.log(e))
  
});


router.get("/account/:id/edit", (req, res, next) => {
User.findById(req.params.id)
.then((oneUser) => {
    res.render("auth/editAccount", {
      user: oneUser,
    });
})
.catch(e => console.log(e))
});


 
router.get("/account/edit", (req, res, next) => {
res.render("auth/editAccount");
});

  module.exports = router;
      
