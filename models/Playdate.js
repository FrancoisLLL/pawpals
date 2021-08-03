const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playdateSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "Pet",
        require: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "Pet",
        require: true
    },
    description: String,
    proposedDate: {
        type: Date,
        required: true
    },
    location: 
        String
        // {
        //     type: String, 
        //     enum: ['Point'], 
        //     required: true
        // },
        // coordinates: 
        // {
        //     type: [Number],
        //     required: true,
        //     default: [2.379853400000002, 48.8648482]
        // }
    ,
    status: {
        type: String,
        enum: ["pending", "confirmed", "rejected", "cancelled", "done"],
        require: true
    },
    senderRating: Number,
    receiverRating: Number
})

const Playdate = mongoose.model("Playdate", playdateSchema);

module.exports = Playdate;