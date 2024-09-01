const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    username:{
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 50,
    },
    password:{
        required: true,
        type: String,
        select: false,// when we retrive any user from the DB, password wont be there
    }
})

module.exports = mongoose.model("user", userSchema)
