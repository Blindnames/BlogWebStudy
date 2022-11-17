const express = require('express')
const article = require('./../models/article')
const Article = require('./../models/article')
const Comment = require('./../models/comment')
const randomid = require('randomid');


const router = express.Router()

router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article })
})

router.post('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  const comments = new Comment({
    parentTitle : article.title,
    description : req.body.description,
    slug : randomid(17)
  });

  try{
    await comments.save();
    res.status(301).redirect(`/articles/${article.slug}`);
  }
  catch(e){
    console.log(`catch error when saving comments: ${e}`)
    res.redirect('/')
  }
  // const comments = await Comment.find({slug: article.title})
  // console.log(comments)
  // if (article == null) res.redirect('/')
  // res.render('articles/show', { article: article ,comments : comments})
})
router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  const comments = await Comment.find({parentTitle : article.title})
  if (article == null) res.redirect('/')
  res.render('articles/show', { article: article ,comments : comments})
})
/*슬러그*/ 


router.get('/write/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  const comment= await Comment.find({slug: article.title})
  res.render('articles/write', { article: article , comment : new Comment()})
})





/*비동기통신*/ 
router.post('/', async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))



/*router.post('articles/show',async(req,res,next) =>{
  req.comment = new Comment()
  next()
},saveCommentAndRedirect)*/
router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))



router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})



function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
  }
}

// function saveCommentAndRedirect() {
//   return async (req, res) => {
//     /* id 안가져오면 findoneslug 로 가져오기 */
//     let article = await Article.findById(req.params.id)
//     let comment = req.comment
//     comment.title = req.body.title
//     comment.description = req.body.description
    
//     try {
//       comment = await comment.save()
      
//     } catch (e) {

      
//     }
//     res.redirect(`/articles/${article.slug}`)
//   }
// }


module.exports = router