const express = require('express')
const article = require('./../models/article')
const Article = require('./../models/article')
const Comment = require('./../models/comment')
const randomid = require('randomid');
const comment = require('./../models/comment');
const router = express.Router()

// articles/new 경로에 새로운 article 객체가 생김 ({article : new Article()})
// title, description, markdown
router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() })
})
// Cannot GET /articles/edit/~~~~~id값 해결위한 라우터
router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  //edit.ejs에 랜더
  res.render('articles/edit', { article: article })
})

router.post('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  const comments = new Comment({
    parentTitle: article.title,
    description: req.body.description,
    slug: randomid(17)
  });

  try {
    await comments.save();
    res.status(301).redirect(`/articles/${article.slug}`);
  }
  catch (e) {
    console.log(`catch error when saving comments: ${e}`)
    res.redirect('/')
  }
})

// 글 작성후 새로운 글에 대한 페이지 article과 commets를 보여줌 게시글 하나만 찾아야함
// url id 값을 사용하는 것 대한 slug를 사용
// title => test articles/test , title => Test Article: Test articles/test-article-test
router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  console.log(article);
  const comments = await Comment.find({ parentTitle: article.title })
  /**.sort({createdAt:'asc'}); */  // 댓글 기능 오름차순으로 정렬  //.first.title
  if (article == null) res.redirect('/')
  // show 페이지에 render 할 것이니 show 페이지를 만들어 보자
  res.render('articles/show', { article: article, comments: comments })
})



router.get('/write/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  const comment = await Comment.find({ slug: article.title })
  res.render('articles/write', { article: article, comment: new Comment() })
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

router.delete('/write/:id', async (req, res) => {
  
  await Comment.findByIdAndDelete(req.params.id)
  // res.render('articles/show',{comment : comment})
  // redirect 경로 설정 문제 title을 어떻게 가져오나
  res.redirect('/articles/'+article.title)
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`) // ${article.id}
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
  }
}
module.exports = router