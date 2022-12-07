const { trim } = require('jquery')
const mongoose = require('mongoose')
// Error: Failed to lookup view "article/join" in views directory "C:\Users\Bae J\Desktop\test\BlogWebStudy\views"
const userSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true,
        maxlength:15,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    pw:{
        type:String,
        require:true,
        minlength:9,
        trim:true   
    }
})

const User = mongoose.model("User",userSchema);
module.exports = {User};