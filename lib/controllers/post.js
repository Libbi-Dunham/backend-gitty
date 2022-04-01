const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Posts');

module.exports = Router().get('/', authenticate, async (req, res, next) => {
  try {
    const posts = await Post.getPosts();
    res.send(posts);
  } catch (error) {
    next(error);
  }
});
