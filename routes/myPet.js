const express = require("express");
const uploader = require("../config/cloudinary");
const router = express.Router();
const Pet = require("../models/Pet")


// SEARCH
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
router.post("/add-my-pet", (req, res, next) => {
    Pet.create(req.body)
    .then((pet) => {
        console.log(pet)
        res.redirect("/");
    })
    .catch((error) => {
        next(error)
    })
}) 

router.get("my-pet/:id", (req,res,next) => {
    Pet.findById(req.params.id)
    .then((petData)=>{
        console.log(pet);
        res.render("myPet.hbs", {
            pet : petData
        })
    })
})

router.get("/my-pet/:id/update", (req, res, next) => {
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