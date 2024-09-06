const mongoose = require("mongoose")
const Schema = mongoose.Schema
const blogSchema = Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 100,
      },
      textBody: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 1000,
      },
      creationDateTime: {
        type: String,
        required: true,
      },
      userId: {
        type: Schema.Types.ObjectId, //ObjectId
        required: true,
        ref: "user", //fk to user collection
      },
      isDeleted:{
        type: Boolean,
        default: false,
      },
      deletionDateTime:{
        type: String
      }//will be added in the run time, and will not be present initially
})

module.exports  = mongoose.model("blog", blogSchema)