const express = require('express');
const router = express.Router();
const requireAuth = require("../middlewares/auth")
const User = require("../models/User");
const Pet = require("../models/Pet")
const Playdate = require("../models/Playdate")
const ObjectId = require('mongoose').Types.ObjectId;
require("../routes/playdates")


router.get('/home', async (req, res, next) => {

  if(req.session.currentPet) { 
    delete req.session.currentPet;
    console.log("req.session.currentPet has ended")
  }

  try {
    const userPets = await Pet.find({
      owner: req.session.currentUser._id
    })

    async function getPlayDates(currentPetId) {
      const confirmed = await Playdate.find({
          status: "confirmed",
          $or: [{
              receiverId: currentPetId
          }, {
              senderId: currentPetId
          }]
      }).populate("senderId").populate("receiverId").exec();
      const pending = await Playdate.find({
          status: "pending",
          receiverId: currentPetId
      }).populate("senderId").populate("receiverId").exec();
  
      const sent = await Playdate.find({
          senderId: currentPetId,
          status: "pending"
      }).populate("senderId").populate("receiverId").exec();
  
      return {
          confirmed,
          pending,
          sent
      }
    }

     userPets.forEach(pet => {
      const result = Playdate.find({_id: pet._id});
      console.log("result", result)
    })


    // const confirmedPlaydates = await Playdate.find({
    //     // $and: [{status: "confirmed"} , {$or: [{senderId : new ObjectId(req.session.currentUser._id)}, {receiverId : new ObjectId(req.session.currentUser._id)}]}]
    //     senderId : new ObjectId(req.session.currentPet._id)
    // })

    // console.log(confirmedPlaydates)

    res.render('home', {
      pet: userPets,
      css: ["home", "style"],
    })

  } catch (error) {next(error)}

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
      
