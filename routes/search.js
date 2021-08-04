const express = require("express");
const uploader = require("../config/cloudinary");
const router = express.Router();
const Pet = require("../models/Pet")

const ObjectId = require('mongoose').Types.ObjectId;

// SEARCH
router.get("/search", (req, res, next) => {
    Pet.find({
            owner: {
                $ne: new ObjectId(req.session.currentUser._id)
            }
        })
        .then((response) => {
            res.render("pets/searchForm.hbs", {
                pet: response,
                type: Pet.schema.path('type').enumValues,
                time : Pet.schema.path('time.0').enumValues,
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