const { trim } = require('jquery')
const mongoose = require('mongoose')
// Error: Failed to lookup view "article(s)/join" in views directory "C:\Users\Bae J\Desktop\test\BlogWebStudy\views"
// 회원가입창에 id/email/pw를 입력해라

// MongoDB에 데이터를 저장하기위해 Schema 생성
const userSchema = new mongoose.Schema({
    userid:{
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


module.exports = mongoose.model("User",userSchema);