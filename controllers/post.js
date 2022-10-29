//here we writes all the logic of our post
const getAllPosts = (req,res, next) => {
    res.send('get all posts')
}

const addNewPost = (req,res,next)=>{
    res.send('add a new post')
}

module.exports = {getAllPosts , addNewPost}