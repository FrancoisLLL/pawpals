const mongoose = require("mongoose")
const Pet = require("../models/pets")

const petsSeeds = [
    {
        name: "Cutesy",
        type: "Cat",
        gender: "Male",
        size: "big",
        dateOfBirth: '2013-05-08',
        description: "loves body rubs and newspaper",
        preferredEnvironment: ["inside", "park"],
        location: "Paris", 
    }
]

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
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