const mongoose = require("mongoose")


const accessSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
    },
    time:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('access', accessSchema)