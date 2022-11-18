const exprees = require('express')
const router = exprees.Router()
const post = require('../controllers/post.js')
const { route } = require('../server.js')


router.get('/',post.getAllPosts)

router.get('/:id',post.getPostById)

router.post('/',post.addNewPost)

router.put('/:id',post.updatePostById)

module.exports = router // obj that return 