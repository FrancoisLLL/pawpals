const express = require('express');
const router = express.Router();
const Playdate = require("../models/playdates")

/* GET users listing. */
router.get('/playdates', async function (req, res, next) {
    const confirmed = await Playdate.find({
        status: "confirmed"
    }).exec();
    const pending = await Playdate.find({
        status: "pending"
    }).exec();
    const sent = await Playdate.find().exec(); //to be updated with receiver ID cookie and stuff

    res.render("./playdates/index.hbs", {
        playdatesConfirmed: confirmed,
        playdatesPending: pending,
        playdatesSent: sent,
    })
});

router.get('/playdates/invite', function (req, res, next) {
    res.render("./playdates/invite.hbs");
});


router.post('/playdates/invite/create', function (req, res, next) {
    Playdate.create({
            proposedDate: req.body.inviteDate,
            // receiverId: 0,
            // senderId: 0,
            description: req.body.inviteDesc,
            status: "pending"
        })
        .then(data => {
            console.log(data);
            res.render("index.hbs")
        })
        .catch(e => console.log(e))
});

router.get('/playdates/invite/:id/accept', function (req, res, next) {
    console.log(req.params.id);
    Playdate.findOneAndUpdate(
            req.params.id, {
                status: "confirmed"
            }
        )
        .then(data => {
            console.log(data);
        })
        .catch(e => console.log(e))
});

router.get('/playdates/invite/:id/reject', function (req, res, next) {
    Playdate.findOneAndUpdate(
            req.params.id, {
                status: "rejected"
            }
        )
        .then(data => {
            console.log(data);
        })
        .catch(e => console.log(e))
});

module.exports = router;