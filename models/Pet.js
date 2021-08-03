const mongoose = require("mongoose")

const Pet = mongoose.model("Pet", {
    name: String,
    type: {
        type: String,
        enum: [
            "Dog", 
            "Cat", 
            "Ferret", 
            "Horse", 
            "Donkey", 
            "Pig", 
            "Goat",
            "Sheep",
            "Mouse",
            "Rat",
            "Hamster",
            "Gerbil",
            "Chinchilla",
            "Guinea pig",
            "Rabbit",
            "Bird",
            "Frog",
            "Fish",
            "Snake",
            "Other"
        ]
    },
    breed: String,
    gender: {
        type: String, 
        enum: ["Male", "Female", "Not specified"],
    },
    size: String,
    dateOfBirth: Date,
    physicalCondition: String,
    description: String,
    preferredEnvironment: [{
        type: String, 
        enum: ["park", "beach", "forest", "street", "stadium", "inside", "cage"]
    }],
    location: String, 
    tags: [String],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    picture: String
})

module.exports = Pet
