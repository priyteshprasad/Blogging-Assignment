const mongoose = require("mongoose")
const Schema = mongoose.Schema

const followSchema = new Schema({
    followerUserId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user", //foregin key should be exactly same as model name //helps to populate user object from user id
    },
    followingUserId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user", 
    },
    creationDateTime:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('follow', followSchema)