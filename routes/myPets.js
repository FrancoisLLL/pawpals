const express = require("express");
const uploader = require("../config/cloudinary");
const router = express.Router();
const Pet = require("../models/Pet");
const User = require("../models/User");

const fileUploader = require('../config/cloudinary');
const petSelected = require("../middlewares/petSelected")

router.get("/pet/:id", async (req, res, next) => {
    try {
        const foundPet = await Pet.findById(req.params.id);

        req.session.currentPet = { _id : foundPet._id}

        console.log(req.session)

        res.render("pets/myPet.hbs", { pet : foundPet })
    }
    catch (error) { next(error) }
})


router.get("/add-pet", (req, res, next) => {
    res.render("pets/addPet.hbs", {
        type: Pet.schema.path('type').enumValues,
        gender: Pet.schema.path('gender').enumValues,
        environment : Pet.schema.path('preferredEnvironment.0').enumValues, 
        time : Pet.schema.path('time.0').enumValues
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


router.get("/pet/:id/edit", (req, res, next) => {
    Pet.findById(req.session.currentPet)
    .then((petData) => {
        res.render("pets/editPet.hbs", {
            type: Pet.schema.path('type').enumValues,
            gender: Pet.schema.path('gender').enumValues,
            environment : Pet.schema.path('preferredEnvironment.0').enumValues,
            time : Pet.schema.path('time.0').enumValues,
            pet : petData
        })
    })
    .catch((error) => next (error))
})

router.post("/pet/:id/edit", (req, res, next) => {
    Pet.findByIdAndUpdate(req.session.currentPet._id, req.body)
    .then((petData) => { res.redirect("/playdates") })
    .catch((error) => next (error))
})


router.get("/pet/:id/delete", (req, res, next) => {
    if('currentPet' in req.session)
        {delete req.session.currentPet}

    Pet.findByIdAndDelete(req.params.id)
    .then((deletedPet) => { res.redirect("/home") })
    .catch(error => next (error))
})

module.exports = router