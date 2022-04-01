const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Posts');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const user = await Post.insert(req.body);
      res.send(user);
    } catch (error) {
      next(error);
    }
  })
  .get('/', authenticate, async (req, res, next) => {
    try {
      const posts = await Post.getPosts();
      res.send(posts);
    } catch (error) {
      next(error);
    }
  });
