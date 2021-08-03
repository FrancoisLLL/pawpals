const express = require("express");
const uploader = require("../config/cloudinary");
const router = express.Router();
const Pet = require("../models/Pet");
const User = require("../models/User");

const fileUploader = require('../config/cloudinary');
const requirePet = require("../middlewares/currentPet")

router.get("/pet/:id", async (req, res, next) => {
    try {
        const foundPet = await Pet.findById(req.params.id);
        // console.log("foundPet", foundPet);


        req.session.currentPet = { _id : foundPet._id}
        // console.log("after req session" + foundPet.id);
        res.render("pets/myPet.hbs", {
            pet : foundPet
        })
    }
    catch (error) { 
        console.log(error);
        next(error)
    }

})


router.get("/add-pet", (req, res, next) => {
    res.render("pets/addPet.hbs", {
        type: Pet.schema.path('type').enumValues,
        gender: Pet.schema.path('gender').enumValues,
        environment : Pet.schema.path('preferredEnvironment.0').enumValues
    })
})


// ADD PET FORM WITHOUT PICTURE
router.post("/add-pet", fileUploader.single("picture"), (req, res, next) => {
    let pet = req.body
    pet.owner = req.session.currentUser._id
    pet.picture = req.file.path;
    Pet.create(pet)
    .then((petData) => {
        console.log(petData)
        res.redirect("/home");
    })
    .catch((error) => {
        next(error)
    })
}) 

// router.get("/pet/:id", (req,res,next) => {
//     Pet.findById(req.params.id)
//     .then((petData)=>{
//         res.render("pets/myPet.hbs", {
//             pet : petData
//         })
//     })
// })

router.get("/pet/:id/edit", (req, res, next) => {
    Pet.findById(req.session.currentPet._id)
    .then((petData) => {
        res.render("pets/editPet.hbs", {
            type: Pet.schema.path('type').enumValues,
            gender: Pet.schema.path('gender').enumValues,
            environment : Pet.schema.path('preferredEnvironment').enumValues,
            pet : petData
        })
    })
    .catch((error) => next (error))
})


router.get("/pet/:id/delete", (req, res, next) => {
    if('currentPet' in req.session)
        {delete req.session.currentPet}

    Pet.findByIdAndDelete(req.params.id)
    .then((deletedPet) => {
        console.log("it has been deleted")
        res.redirect("/home")
    })
    .catch(error => console.log(error))
    
})

module.exports = router