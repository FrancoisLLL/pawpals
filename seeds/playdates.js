require("dotenv").config();
const mongoose = require("mongoose");
require('../config/mongo')
const Playdate = require('../models/Playdate')
const Pets = require('../models/Pet')

const playdateSeeds = [{
        senderId: "Fluffy",
        receiverId: "Cutesy",
        description: "I am the best cat in the neighbourhood",
        proposedDate: "2021-08-02",
        status: "pending"
    },
    {
        senderId: "Fluffy",
        receiverId: "Cutesy",
        description: "I am the best dog in the neighbourhood",
        proposedDate: "2021-08-03",
        status: "pending"
    },
    {
        senderId: "Fluffy",
        receiverId: "Cutesy",
        description: "I am not nice but your only option int he area",
        proposedDate: "2021-08-04",
        status: "pending"
    },
    {
        senderId: "Cutesy",
        receiverId: "Fluffy",
        description: "No - I am the best cat of the neighbourhood",
        proposedDate: "2021-08-02",
        status: "pending"
    },
    {
        senderId: "Cutesy",
        receiverId: "Fluffy",
        description: "I am the best cat in the neighbourhood",
        proposedDate: "2021-08-06",
        status: "confirmed"
    },
    {
        senderId: "Cutesy",
        receiverId: "Fluffy",
        description: "I live dangerously, come play with me dog",
        proposedDate: "2021-08-03",
        status: "rejected"
    },
    {
        senderId: "Cutesy",
        receiverId: "Fluffy",
        description: "I am the best cat in the neighbourhood",
        proposedDate: "2021-08-02",
        status: "confirmed"
    },
    {
        senderId: "Cutesy",
        receiverId: "Fluffy",
        description: "I am the best cat in the neighbourhood",
        proposedDate: "2021-08-01",
        status: "done"
    }
]

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => {
        Playdate.deleteMany();
    })
    .then(() => {

        insert();
    })
    .catch(e => console.log(e))


function insert() {
    playdateSeeds.forEach((playdate, index, array) => {
        Pets.findOne({
                name: playdate.senderId
            })
            .then(senderFound => {
                playdate.senderId = senderFound._id;
                Pets.findOne({
                        name: playdate.receiverId
                    })
                    .then((receiverFound) => {
                        playdate.receiverId = receiverFound._id;

                        Playdate.create(playdate)
                            .then(data => console.log("data created", data))
                            .catch(e => console.log(e))
                    })
                    .catch(e => console.log(e))
            })
            .catch(e => console.log(e))
    })

}

mongoose.connection.on("connected", () => console.log("yay mongodb connected :)"));

mongoose.connection.on("error", () => console.log("nay db error sorry :("));