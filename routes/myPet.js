const express = require("express");
const uploader = require("../config/cloudinary");
const router = express.Router();
const Pet = require("../models/Pet")



// console.log(Pet.schema.path("preferredEnvironment.0").enumValues)



router.get("/add-pet", (req, res, next) => {
    res.render("pets/addPet.hbs", {
        type: Pet.schema.path('type').enumValues,
        gender: Pet.schema.path('gender').enumValues,
        environment : Pet.schema.path('preferredEnvironment.0').enumValues

    })
})

// WITH PICTURE
/* router.post("/add-pet", uploader.single("picture"), (req, res, next) => {
    const { name } = req.body;

    const newPet = { name };

    if ( req.file !== undefined) {
        newPet.picture = req.file.path
    }

    Pet.create(newPet)
    .then((pet) => {
        console.log(pet)
        res.redirect("/");
    })
    .catch((error) => {
        next(error)
    })
}) */


// ADD PET FORM WITHOUT PICTURE
router.post("/add-pet", (req, res, next) => {
    let pet = req.body
    pet.owner = req.session.currentUser._id

    Pet.create(pet)
    .then((petData) => {
        console.log(petData)
        res.redirect("/add-pet");
    })
    .catch((error) => {
        next(error)
    })
}) 

router.get("/pet/:id", (req,res,next) => {
    Pet.findById(req.params.id)
    .then((petData)=>{
        console.log(pet);
        res.render("myPet.hbs", {
            pet : petData
        })
    })
})

router.get("/pet/:id/edit", (req, res, next) => {
    Pet.findById(req.params.id)
    .then((catData) => {
        res.render("pets/updatePet.hbs", {
            type: Pet.schema.path('type').enumValues,
            gender: Pet.schema.path('gender').enumValues,
            environment : Pet.schema.path('preferredEnvironment').enumValues,
            pet : catData
        })
    })
    .catch((error) => next (error))
})


module.exports = router