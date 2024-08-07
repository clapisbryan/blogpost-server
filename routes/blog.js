const express = require('express');

const blogController = require('../controllers/blog.js')

const { verify, isLoggedIn, verifyAdmin } = require('../auth.js');

const router = express.Router();

router.get('/getPosts', blogController.getPosts);

router.post('/addPost', verify, blogController.addPost);

router.get('/getPost/:postId', blogController.getPostById);

router.patch('/updatePost/:postId', verify, blogController.updatePost);

router.delete('/deletePost/:postId', verify, verifyAdmin, blogController.deletePost);

router.patch('/addComment/:postId', verify, blogController.addComment);

router.get('/getComments/:postId', blogController.getComments);

router.delete('/deleteComment/:postId/:commentId', verify, blogController.deleteComment);

module.exports = router;