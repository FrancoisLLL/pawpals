const express = require("express");
const uploader = require("../config/cloudinary");
const router = express.Router();
const Pet = require("../models/Pet")

router.get("/search", (req, res, next) => {
    Pet.find()
    .then((response) => {
        res.render("pets/petList.hbs", {
            pet: response,
            css: ["style.css", 'pets.css']
        });
    })
    .catch((error) => {
        next(error)
    })
})

// router.get("/:id", (req, res, next) => {
//     Pet.findById(req.params.id)
//     .then((response) => {
//         res.render("pets/onePet.hbs", {
//             pet: response,
//             css: ["style.css", 'pets.css']
//         });
//     })
//     .catch((error) => {
//         next(error)
//     })
// })


router.get("/add-pet", (req, res, next) => {
    res.render("pets/addPet.hbs", {
        type: Pet.schema.path('type').enumValues,
        gender: Pet.schema.path('gender').enumValues,
        environment : Pet.schema.path('preferredEnvironment').enumValues

    })
})

router.post("/", uploader.single("picture"), (req, res, next) => {
    const { name } = req.body;

    const newPet = { name};

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
})

module.exports = router