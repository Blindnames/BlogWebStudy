const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  markdown: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  }
})

// 업데이트 생성 삭제를 저장할 때마다 기사에 대한 유효성 검사를 수행하기 직전에 이 함수를 실행
articleSchema.pre('validate', function(next) {
  if (this.title) {
    // lower : true 슬러그를 소문자로 변환하고 있는지 확인
    // strict를 사용해 문자 숫자 가 아닌 다른 값이 들어왔을때 자동으로 제거해 줌
    this.slug = slugify(this.title, { lower: true, strict: true })
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
  }

  next()
})

module.exports = mongoose.model('Article', articleSchema)