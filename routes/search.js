const express = require("express");
const uploader = require("../config/cloudinary");
const router = express.Router();
const Pet = require("../models/Pet")

const ObjectId = require('mongoose').Types.ObjectId;

// SEARCH
router.get("/search", (req, res, next) => {
    Pet.find(
        { owner: { $ne: new ObjectId(req.session.currentUser._id) } }
        )
        .then((response) => {
            res.render("pets/searchForm.hbs", {
                pet: response,
                type: Pet.schema.path('type').enumValues,
                time : Pet.schema.path('time.0').enumValues,
                css: ["style", "search"],
                scripts: ["search"],
                bootstrap: `<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">`
            });
        })
        .catch((error) => {
            console.log(error);
            next(error)
        })
})

router.get("/search/filter", (req, res, next) => {
    Pet.find(req.query)
    .then((response) => {
        console.log(req.query);
        res.render("pets/searchForm.hbs", {
            pet: response,
            type: Pet.schema.path('type').enumValues,
            time : Pet.schema.path('time.0').enumValues,
            css: ["style", "search"],
            scripts: ["search"],
        });
        
    })
    .catch((error) => {
        console.log(error);
        next(error)
    })
})

router.get("/search/:id", (req, res, next) => {
    Pet.findById(req.params.id)
        .then((response) => {
            res.render("pets/onePet.hbs", {
                pet: response
            });
        })
        .catch((error) => {
            next(error)
        })
})


module.exports = router