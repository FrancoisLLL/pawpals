const express = require('express');
const router = express.Router();
const requireAuth = require("../middlewares/auth")
const User = require("../models/User");
const Pet = require("../models/Pet")
const Playdate = require("../models/Playdate")
const ObjectId = require('mongoose').Types.ObjectId;
const {
  LoopDetected
} = require('http-errors');
require("../routes/playdates")


router.get('/home', requireAuth, async (req, res, next) => {

  if (req.session.currentPet) {
    delete req.session.currentPet;
  }

  const userPets = await Pet.find({
    owner: req.session.currentUser._id
  })

  let nextPlaydate = 0

  for (let i = 0; i < userPets.length; i++) {
    nextPlaydate = "None";
    const confirmed = await Playdate.find({
      status: "confirmed",
      $or: [{
        receiverId: userPets[i]._id
      }, {
        senderId: userPets[i]._id
      }]
    }).sort("proposedDate")

    const pending = await Playdate.find({
      status: "pending",
      receiverId: userPets[i]._id
    })

    if (confirmed[0] != null) {
      console.log(confirmed[0].description, confirmed[0].proposedDate);
      nextPlaydate = confirmed[0].proposedDate.toDateString();
    }

    userPets[i] = userPets[i].toObject();
    userPets[i].confirmedPlaydates = confirmed.length;
    userPets[i].pendingInvites = pending.length;
    userPets[i].next = nextPlaydate;
  }

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



router.get("/account/edit", (req, res, next) => {
  res.render("auth/editAccount");
});

module.exports = router;