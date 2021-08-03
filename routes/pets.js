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


module.exports = router