
const express = require('express');
const Article = require('./../models/article');
const router = express.Router();


router.get('/new',function(req,res){
    res.render('articles/new')
});
router.get('/:id',async function(req,res){
    const article = await Article.findById(req.params.id)
    if (article == null) res.redirect('/')
    res.render('articles/show',{article:article})
    

})
router.post('/',async function(req,res){
    let article = new Article({
        title : req.body.title,
        description : req.body.description,
        markdown : req.body.markdown,
        
    })
    try{
       article =  await article.save();
       res.redirect(`/articles/${article.id}`)
    } catch (e){
        console.log(e)
        res.render('articles/new',{article:article})

    }

});
module.exports = router;