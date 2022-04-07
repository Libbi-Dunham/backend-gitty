const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Posts');

module.exports = Router()
  .post('/', authenticate, (req, res, next) => {
    Post.insert({
      ...req.body,
      // tile: req.user.title,
      // content: req.user.content,a
    })
      .then((post) => res.send(post))
      .catch((error) => next(error));
    // try {
    //   const user = await Post.insert(req.body);
    //   res.send(user);
    // } catch (error) {
    //   next(error);
  })

  .get('/', authenticate, (req, res, next) => {
    Post.getPosts()
      .then((post) => res.send(post))
      .catch((error) => next(error));
    // try {
    //   const posts = await Post.getPosts();
    //   res.send(posts);
    // } catch (error) {
    //   next(error);
    // }
  });
