const { Router } = require('express');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');
const ONLY_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
    );
  })

  .get('/login/callback', (req, res) => {
    const { code } = req.query;
    let user;
    exchangeCodeForToken(code)
      .then((token) => getGithubProfile(token))

      .then(({ login, email }) =>
        GithubUser.findByUsername(login).then((value) => {
          if (value) {
            user = value;
          } else {
            GithubUser.insert({
              username: login,
              email,
            }).then((value) => (user = value));
          }
        })
      )
      .then(() => {
        const payload = jwt.sign({ ...user }, process.env.JWT_SECRET, {
          expiresIn: '1 day',
        });

        res
          .cookie(process.env.COOKIE_NAME, payload, {
            httpOnly: true,
            maxAge: ONLY_DAY_IN_MS,
          })
          .redirect('/api/v1/github/dashboard');
      });
  })

  .get('/dashboard', authenticate, async (req, res) => {
    res.json(req.user);
  })

  .delete('/login', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Successfully signed out' });
  });
