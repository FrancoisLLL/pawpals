const express = require('express');
const router = express.Router();
const Playdate = require("../models/Playdate")
const Pet = require("../models/Pet")
const User = require("../models/User")

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

function renderPlaydates(res, playDates, currentPet) {
    res.render("./playdates/index.hbs", {
        playdatesConfirmed: playDates.confirmed,
        playdatesConfirmedLength: playDates.confirmed.length,
        playdatesPending: playDates.pending,
        playdatesPendingLength: playDates.pending.length,
        playdatesSent: playDates.sent,
        playdatesSentLength: playDates.sent.length,
        currentPet: currentPet,
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
    renderPlaydates(res, playDates, foundPet)
});

router.get('/playdates/:id/invite/', checkPet, async function (req, res, next) {
    const foundPet = await Pet.findById(req.params.id);

    res.render("./playdates/invite.hbs", {
        guest: foundPet,
        date: '2021-08-01T00:00',
        key: process.env.GOOGLEMAPS_KEY,
        css: ["tabs"]
    });
});


router.post('/playdates/invite/:guestId', checkPet, async function (req, res, next) {

    const foundPet = await Pet.findById(req.session.currentPet);

    console.log(req.body.lat);
    console.log(req.body.lng);
    Playdate.create({
            proposedDate: req.body.inviteDate,
            receiverId: req.params.guestId,
            senderId: req.session.currentPet._id,
            description: req.body.inviteDesc,
            status: "pending",
            location: req.body.address,
            lat: req.body.lat,
            lng: req.body.lng
        })
        .then(async (data) => {
            console.log(data);
            const playDates = await getPlayDates(req.session.currentPet._id);

            renderPlaydates(res, playDates, foundPet)

        })
        .catch(e => console.log(e))
});

router.get('/playdates/invite/:id', checkPet, async function (req, res, next) {
    // console.log(req.params.id);

    const foundPet = await Pet.findById(req.session.currentPet);

    const playdate = await Playdate.findById(req.params.id)
        .populate("senderId")
        .populate("receiverId")
        .exec()

    const senderOwner = await User.findById(playdate.senderId.owner);
    const receiverOwner = await User.findById(playdate.receiverId.owner);

    // console.log(owner);
    // console.log(playdate);

    res.render("playdates/inviteDetails", {
        invite: playdate,
        isOwner: req.session.currentPet._id.toString() === playdate.senderId._id.toString() ? true : false,
        isPending: playdate.status === "pending",
        senderOwner: senderOwner,
        receiverOwner:receiverOwner, 
        isConfirmed: playdate.status ==="confirmed",
        css: ["tabs"],
        key: process.env.GOOGLEMAPS_KEY,
    })



})


router.get('/playdates/invite/:id/accept', checkPet, async function (req, res, next) {
    // console.log("accept playdate id" + req.params.id);
    const foundPet = await Pet.findById(req.session.currentPet);

    Playdate.findOneAndUpdate({
            _id: req.params.id
        }, {
            status: "confirmed"
        })
        .then(async data => {
            console.log(data);
            const playDates = await getPlayDates(req.session.currentPet._id);

            renderPlaydates(res, playDates, foundPet)

        })
        .catch(e => console.log(e))
});

router.get('/playdates/invite/:id/reject', checkPet, async function (req, res, next) {
    const foundPet = await Pet.findById(req.session.currentPet);

    Playdate.findOneAndUpdate({
            _id: req.params.id
        }, {
            status: "rejected"
        })
        .then(async data => {
            // console.log(data);
            const playDates = await getPlayDates(req.session.currentPet._id);

            renderPlaydates(res, playDates, foundPet)

        })
        .catch(e => console.log(e))
});

router.get('/playdates/invite/:id/cancel', checkPet, async function (req, res, next) {
    const foundPet = await Pet.findById(req.session.currentPet);

    Playdate.findOneAndUpdate({
            _id: req.params.id
        }, {
            status: "cancelled"
        })
        .then(async data => {
            console.log(data);
            const playDates = await getPlayDates(req.session.currentPet._id);

            renderPlaydates(res, playDates, foundPet)

        })
        .catch(e => console.log(e))
});

module.exports = router;