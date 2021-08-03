require("dotenv").config();
require("../config/mongo");
const mongoose = require("mongoose");
const Pet = require("../models/Pet");
const User = require("../models/User");

const petsSeeds = [
    {
        name: "Cutesy",
        type: "Cat",
        gender: "Male",
        size: "big",
        dateOfBirth: '2013-05-08',
        description: "loves body rubs and newspaper",
        preferredEnvironment: ["inside", "park"],
    },
    {
        name: "Fluffy",
        type: "Dog",
        gender: "Not specified",
        size: "small",
        dateOfBirth: '2012-06-23',
        description: "loves warm hugs",
        preferredEnvironment: ["beach", "forest"],
    }
]

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})
.then(() => {
    return Pet.deleteMany();
})
.then(() => {
    Pet.create(petsSeeds)
    .then((createdPets) => {
    })
    .catch((error) => {
        console.log(error)
    })
})
.catch((error) => {
    console.log(error)
})