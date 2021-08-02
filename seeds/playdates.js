require("dotenv").config();
const mongoose = require("mongoose");
const Playdate = require("../models/playdates");
require('../config/mongodb')
const Playdates = require('../models/playdates')
const Users = require('../models/users')

const playdateSeeds = [{
        senderId: cat1,
        receiverId: cat2,
        description: "I am the best cat in the neighbourhood",
        proposedDate: "2021-08-02",
        status: "pending"
    },
    {
        senderId: dog1,
        receiverId: dog2,
        description: "I am the best dog in the neighbourhood",
        proposedDate: "2021-08-03",
        status: "pending"
    },
    {
        senderId: cat1,
        receiverId: cat3,
        description: "I am not nice but your only option int he area",
        proposedDate: "2021-08-04",
        status: "pending"
    },
    {
        senderId: cat2,
        receiverId: cat1,
        description: "No - I am the best cat of the neighbourhood",
        proposedDate: "2021-08-02",
        status: "pending"
    },
    {
        senderId: cat1,
        receiverId: cat3,
        description: "I am the best cat in the neighbourhood",
        proposedDate: "2021-08-06",
        status: "confirmed"
    },
    {
        senderId: cat1,
        receiverId: dog1,
        description: "I live dangerously, come play with me dog",
        proposedDate: "2021-08-03",
        status: "rejected"
    },
    {
        senderId: cat1,
        receiverId: cat2,
        description: "I am the best cat in the neighbourhood",
        proposedDate: "2021-08-02",
        status: "confirmed"
    },
    {
        senderId: cat1,
        receiverId: cat2,
        description: "I am the best cat in the neighbourhood",
        proposedDate: "2021-08-01",
        status: "done"
    }
]

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }).then(() => {

        insert();
    })
    .catch(e => console.log(e))


function insert() {
    playdateSeeds.forEach((playdate, index, array) => {
        Users.findOne({
                username: playdate.senderId
            })
            .then(userFound => {
                playdate.senderId = userFound._id;
                Users.findOne({
                        username: playdate.receiverId
                    })
                    .then(() => {
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