const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const Comment = require('./models/comment')
const articleRouter = require('./routes/articles')

const methodOverride = require('method-override')
const comment = require('./models/comment')
const app = express()

const db = mongoose.connect('mongodb+srv://wnsdhqo:gkrehd102@cluster0.aoo8syv.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})




app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  const article = await Article.findOne({title : articles.title})
  const comment = await Comment.find({parentTitle : articles.title})
  res.render('articles/index', { articles: articles , length : Object.keys(comment).length })
  
})
app.use('/articles', articleRouter)

/*app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  const Comment = await Comment.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
})

app.use('/articles', articleRouter)
*/

app.listen(5000)



