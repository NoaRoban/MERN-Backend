const exprees = require('express')
const router = exprees.Router()
const post = require('../controllers/post.js')


router.get('/',post.getAllPosts)

router.post('/',post.addNewPost)

module.exports = router // obj that return 