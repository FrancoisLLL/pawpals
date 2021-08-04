const express = require('express');
const router = express.Router();
const Playdate = require("../models/Playdate")
const Pet = require("../models/Pet")

const checkPet = require("../middlewares/petSelected")
const requireAuth = require("../middlewares/auth")

async function getPlayDates(currentPetId) {
    const confirmed = await Playdate.find({
        status: "confirmed",
        $or: [{
            receiverId: currentPetId
        }, {
            senderId: currentPetId
        }]
    }).populate("senderId").populate("receiverId").exec();
    const pending = await Playdate.find({
        status: "pending",
        receiverId: currentPetId
    }).populate("senderId").populate("receiverId").exec();

    const sent = await Playdate.find({
        senderId: currentPetId,
        status: "pending"
    }).populate("senderId").populate("receiverId").exec();

    return {
        confirmed,
        pending,
        sent
    }
}

function renderPlaydates(res, playDates, user) {
    res.render("./playdates/index.hbs", {
        playdatesConfirmed: playDates.confirmed,
        playdatesConfirmedLength: playDates.confirmed.length,
        playdatesPending: playDates.pending,
        playdatesPendingLength: playDates.pending.length,
        playdatesSent: playDates.sent,
        playdatesSentLength: playDates.sent.length,
        user: user,
        css: ["tabs"]
    })
}

router.get('/:id/playdates', requireAuth, async function (req, res, next) {
    //to be updated with receiver ID cookie and stuff

    const foundPet = await Pet.findById(req.params.id);

    if(!req.session.currentPet) {
        req.session.currentPet = { _id: foundPet._id }
    }
    const playDates = await getPlayDates(req.session.currentPet._id);

    // console.log(playDates.confirmed.length, playDates.pending.length, playDates.sent.length)
    renderPlaydates(res, playDates, req.session.currentPet)
});

router.get('/playdates/:id/invite/', checkPet, function (req, res, next) {
    console.log("req params " + req.params.id)
    res.render("./playdates/invite.hbs", {
        guestId: req.params.id,
        date: '2021-08-01T00:00',
        key: process.env.GOOGLEMAPS_KEY,
        css: ["tabs"]
    });
});


router.post('/playdates/invite/:guestId', checkPet, function (req, res, next) {

    Playdate.create({
            proposedDate: req.body.inviteDate,
            receiverId: req.params.guestId,
            senderId: req.session.currentPet._id,
            description: req.body.inviteDesc,
            status: "pending",
            location: req.body.address
        })
        .then(async (data) => {
            console.log(data);
            const playDates = await getPlayDates(req.session.currentPet._id);

            renderPlaydates(res, playDates, req.session.currentPet)


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
            console.log(data);
            // console.log("pet id " + req.session.currentPet._id + " sender: " + data.senderId._id)
            res.render("playdates/inviteDetails", {
                invite: data,
                isOwner: req.session.currentPet._id.toString() === data.senderId._id.toString() ? true : false,
                isPending: data.status === "pending",
                css: ["style","tabs"]
            })
        })
        .catch(e => console.log(e))
});


router.get('/playdates/invite/:id/accept', checkPet, function (req, res, next) {
    // console.log("accept playdate id" + req.params.id);
    Playdate.findOneAndUpdate({
            _id: req.params.id
        }, {
            status: "confirmed"
        })
        .then(async data => {
            console.log(data);
            const playDates = await getPlayDates(req.session.currentPet._id);

            renderPlaydates(res, playDates, req.session.currentPet)

        })
        .catch(e => console.log(e))
});

router.get('/playdates/invite/:id/reject', checkPet, function (req, res, next) {
    Playdate.findOneAndUpdate({
            _id: req.params.id
        }, {
            status: "rejected"
        })
        .then(async data => {
            // console.log(data);
            const playDates = await getPlayDates(req.session.currentPet._id);

            renderPlaydates(res, playDates, req.session.currentPet)

        })
        .catch(e => console.log(e))
});

router.get('/playdates/invite/:id/cancel', checkPet, function (req, res, next) {
    Playdate.findOneAndUpdate({
            _id: req.params.id
        }, {
            status: "cancelled"
        })
        .then(async data => {
            console.log(data);
            const playDates = await getPlayDates(req.session.currentPet._id);

            renderPlaydates(res, playDates, req.session.currentPet)

        })
        .catch(e => console.log(e))
});

module.exports = router;