const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const commentSchema = new mongoose.Schema({
  parentTitle :{
    type:String,
    require : true

  },
  description: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  slug : {
    type : String,
    unique : true,

  }
  

})




commentSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  



  next()
})

module.exports = mongoose.model('Comment', commentSchema)