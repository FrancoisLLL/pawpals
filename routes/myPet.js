const express = require("express");
const uploader = require("../config/cloudinary");
const router = express.Router();
const Pet = require("../models/Pet");
const User = require("../models/User");



// console.log(Pet.schema.path("preferredEnvironment.0").enumValues)


router.get("/pet/:id", async (req, res, next) => {
    try {
        const foundPet = await Pet.findById(req.params.id);
        console.log("foundPet", foundPet);


        req.session.currentPet = { _id : foundPet._id}
        console.log("after req session" + foundPet.id);
        res.render("pets/myPet.hbs", {
            pet : foundPet
        })
    }
    catch (error) { 
        console.log(error);
        next(error)
    }

})

router.get("/homepage", (req,res,next) => {
    req.session.destroy((error) => {
        if (error) {
            next(error);
        } else {
            res.redirect("/homepage")
        }
    })
})



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

// router.get("/pet/:id", (req,res,next) => {
//     Pet.findById(req.params.id)
//     .then((petData)=>{
//         res.render("pets/myPet.hbs", {
//             pet : petData
//         })
//     })
// })

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