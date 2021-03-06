const express = require("express");
const uploader = require("../config/cloudinary");
const router = express.Router();
const Pet = require("../models/Pet");
const User = require("../models/User");

const fileUploader = require('../config/cloudinary');
const petSelected = require("../middlewares/petSelected")


router.get("/add-pet", (req, res, next) => {
    res.render("pets/addPet.hbs", {
        type: Pet.schema.path('type').enumValues,
        gender: Pet.schema.path('gender').enumValues,
        environment : Pet.schema.path('preferredEnvironment.0').enumValues, 
        time : Pet.schema.path('time.0').enumValues,
        size: Pet.schema.path('size').enumValues,
        css: ["editpet"]
    })
})


router.post("/add-pet", fileUploader.single("picture"), (req, res, next) => {
    let pet = req.body
    pet.owner = req.session.currentUser._id

    pet.picture = req.file.path;

    Pet.create(pet)
    .then((petData) => { res.redirect("/home") })
    .catch((error) => { next(error) })
}) 


router.get("/:id", async (req,res,next) => {
    await Pet.findById(req.params.id)
    .then((response) => {
        const foundPet = response;
        if(!req.session.currentPet) req.session.currentPet = { _id : foundPet._id};
        console.log("CURRENT PET SESSION HAS STARTED", req.session)
        res.render("pets/myPet.hbs", {
            pet: foundPet, 
            css: ["petProfile"]
        })
    })
    .catch(error => next(error))  
})

router.get("/:id/edit", (req, res, next) => {
    Pet.findById(req.params.id)
    .then((petData) => {
        res.render("pets/editPet.hbs", {
            type: Pet.schema.path('type').enumValues,
            gender: Pet.schema.path('gender').enumValues,
            environment : Pet.schema.path('preferredEnvironment.0').enumValues,
            time : Pet.schema.path('time.0').enumValues,
            size: Pet.schema.path('size').enumValues,
            pet : petData,
            css: ["editpet"]
        })
    })
    .catch((error) => next (error))
})

router.post("/:id/edit", fileUploader.single("picture"), (req, res, next) => {
    let pet = req.body
    pet.owner = req.session.currentUser._id

    if (req.file && req.file.path)
    {pet.picture = req.file.path;}

    console.log("update form works", req.body)

    Pet.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then((petData) => { console.log("UPDATED PET", petData); res.redirect("/home")  })
    .catch((error) => next (error))
})


router.get("/:id/delete", (req, res, next) => {
    if('currentPet' in req.session)
        {delete req.session.currentPet}

    Pet.findByIdAndDelete(req.params.id)
    .then((deletedPet) => { res.redirect("/home") })
    .catch(error => next (error))
})

module.exports = router