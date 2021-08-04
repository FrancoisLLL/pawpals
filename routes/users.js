const express = require('express');
const router = express.Router();
const requireAuth = require("../middlewares/auth")
const User = require("../models/User");
const Pet = require("../models/Pet")


      router.get('/home', (req, res, next) => {
        Pet.find({
            owner: req.session.currentUser._id
            
          })
          .then((myPetsData) => {
            console.log(myPetsData);
            res.render('home', {
              pet: myPetsData
            })
          })
          .catch(error => next(error))
      });

    



  

      router.post("/account/:id/edit", (req, res, next) => {
        User.findByIdAndUpdate(req.params.id, req.body)
          .then((userDetails) => {
            res.redirect("/account/" + userDetails._id);
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
      
