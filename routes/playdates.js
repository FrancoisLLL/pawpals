const express = require('express');
const router = express.Router();
const Playdate = require("../models/Playdate")

const checkPet = require("../middlewares/petSelected")

async function getPlayDates(currentPetId) {
    const confirmed = await Playdate.find({
        status: "confirmed",
        $or: [{ receiverId: currentPetId}, { senderId: currentPetId}] 
    }).populate("senderId").populate("receiverId").exec();
    const pending = await Playdate.find({
        status: "pending",
        receiverId: currentPetId
    }).populate("senderId").populate("receiverId").exec();

    const sent = await Playdate.find({
        senderId : currentPetId,
        status: "pending"
    }).populate("senderId").populate("receiverId").exec();

    return {
        confirmed,
        pending,
        sent
    }
}

router.get('/playdates', checkPet, async function (req, res, next) {
    //to be updated with receiver ID cookie and stuff
    console.log(req.session.currentPet)
    const playDates = await getPlayDates(req.session.currentPet._id);

    res.render("./playdates/index.hbs", {
        playdatesConfirmed: playDates.confirmed,
        playdatesPending: playDates.pending,
        playdatesSent: playDates.sent,
    })
}); 

router.get('/playdates/invite', checkPet, function (req, res, next) {
    res.render("./playdates/invite.hbs");
});


router.post('/playdates/invite', checkPet, function (req, res, next) {
    Playdate.create({
            proposedDate: req.body.inviteDate,
            // receiverId: 0,
            senderId: req.session.currentPet._id,
            description: req.body.inviteDesc,
            status: "pending"
        })
        .then(async (data) => {
            console.log(data);
            const playDates = await getPlayDates(req.session.currentPet._id);

            res.render("playdates/index.hbs", {
                playdatesConfirmed: playDates.confirmed,
                playdatesPending: playDates.pending,
                playdatesSent: playDates.sent,
            })
        })
        .catch(e => console.log(e))
});

router.get('/playdates/invite/:id', checkPet, function (req, res, next) {
    // console.log(req.params.id);

    Playdate.findOne({
            _id: req.params.id
        })
        .populate("senderId")
        .populate("receiverId")
        .then(data => {
            // console.log(data);
            console.log("pet id " + req.session.currentPet._id + " sender: " + data.senderId._id )
            res.render("playdates/inviteDetails", {
                invite: data,
                isOwner: req.session.currentPet._id.toString() === data.senderId._id.toString() ? true: false
            })
        })
        .catch(e => console.log(e))
});


router.get('/playdates/invite/:id/accept', checkPet, function (req, res, next) {
    // console.log("accept playdate id" + req.params.id);
    Playdate.findOneAndUpdate(
            {_id: req.params.id}, {
                status: "confirmed"
            }
        )
        .then(async data => {
            console.log(data);
            const playDates = await getPlayDates(req.session.currentPet._id);

            res.render("./playdates/index.hbs", {
                playdatesConfirmed: playDates.confirmed,
                playdatesPending: playDates.pending,
                playdatesSent: playDates.sent,
            })
        })
        .catch(e => console.log(e))
});

router.get('/playdates/invite/:id/reject', checkPet, function (req, res, next) {
    Playdate.findOneAndUpdate(
        {_id: req.params.id}, {
                status: "rejected"
            }
        )
        .then(async data => {
            // console.log(data);
            const playDates = await getPlayDates(req.session.currentPet._id);

            res.render("./playdates/index.hbs", {
                playdatesConfirmed: playDates.confirmed,
                playdatesPending: playDates.pending,
                playdatesSent: playDates.sent,
            })
        })
        .catch(e => console.log(e))
});

router.get('/playdates/invite/:id/cancel', checkPet, function (req, res, next) {
    Playdate.findOneAndUpdate(
        {_id: req.params.id}, {
                status: "cancelled"
            }
        )
        .then(async data => {
            console.log(data);
            const playDates = await getPlayDates(req.session.currentPet._id);

            res.render("./playdates/index.hbs", {
                playdatesConfirmed: playDates.confirmed,
                playdatesPending: playDates.pending,
                playdatesSent: playDates.sent,
            })
        })
        .catch(e => console.log(e))
});

module.exports = router;