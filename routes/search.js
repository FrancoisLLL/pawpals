const express = require("express");
const uploader = require("../config/cloudinary");
const router = express.Router();
const Pet = require("../models/Pet")
const requireAuth = require("../middlewares/auth")

const ObjectId = require('mongoose').Types.ObjectId;


router.get("/:id/search", requireAuth, async (req, res, next) => {
    
    await Pet.findById(req.params.id)
    .then((response) => {
        const foundPet = response;
        req.session.currentPet = {_id: foundPet._id};
        console.log("CURRENT PET SESSION HAS STARTED", req.session);
    })
    .catch(error => next(error))
    
    const foundPet = req.session.currentPet
    
    Pet.find({ owner: { $ne: new ObjectId(req.session.currentUser._id) } })
    .then((response) => {
        res.render("pets/searchForm.hbs", {
            pet: response, // to display all the PETS INFO
            type: Pet.schema.path('type').enumValues,
            time: Pet.schema.path('time.0').enumValues,
            size: Pet.schema.path('size').enumValues,
            css: ["style", "search"],
            scripts: ["search"],
            currentPet : foundPet
        });
    })
    .catch((error) => {
        console.log(error);
        next(error)
    })
})


router.get("/search/filter", (req, res, next) => {
    // console.log(req.query.owner = { $ne: new ObjectId(req.session.currentUser._id) });
    // console.log(req.query);
    req.query.owner = { $ne: new ObjectId(req.session.currentUser._id) };
    Pet.find(req.query)
    .then((response) => {
        res.render("pets/searchForm.hbs", {
            pet: response,
            type: Pet.schema.path('type').enumValues,
            time: Pet.schema.path('time.0').enumValues,
            size: Pet.schema.path('size').enumValues,
            css: ["style", "search"],
            scripts: ["search"]
        })
    })
    .catch(error => next(error))
})

router.get("/search/:id", requireAuth, (req, res, next) => {
    Pet.findById(req.params.id)
    .then((response) => {
        res.render("pets/onePet.hbs", {
            pet: response,
            css: ["petProfile"]
        });
    })
    .catch((error) => {
        next(error)
    })
})


module.exports = router





// router.get("/search/filter", (req, res, next) => {
//     Pet.find(req.query)
//     .then((response) => {
//         console.log(req.query);
//         res.render("pets/searchForm.hbs", {
//             pet: response,
//             type: Pet.schema.path('type').enumValues,
//             time : Pet.schema.path('time.0').enumValues,
//             css: ["style", "search"],
//             scripts: ["search"],
//         });
        
//     })
//     .catch((error) => {
//         console.log(error);
//         next(error)
//     })
// })




// SEARCH
// router.get("/:id/search-playmate", requireAuth, async (req, res, next) => {
//     try {
//         const foundPet = await Pet.findById(req.params.id);
//         if(!req.session.currentPet) req.session.currentPet = { _id : foundPet._id};
//         console.log("CURRENT PET SESSION HAS STARTED", req.session)

//         Pet.find({
//                 owner: {
//                     $ne: new ObjectId(req.session.currentUser._id)
//                 }
//             })
//             .then((response) => {
//                 res.render("pets/searchForm.hbs", {
//                     type: Pet.schema.path('type').enumValues,
//                     time: Pet.schema.path('time.0').enumValues,
//                     css: ["style", "search"],
//                 });
//             })
//             .catch((error) => {
//                 console.log(error);
//                 next(error)
//             })
//     } catch { error => console.log(error) }
// })