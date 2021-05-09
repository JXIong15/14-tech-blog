const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const sequelize = require("../config/connection");
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
    Post.findAll({
      include: [User],
    })
    .then((postData) => {
        // Serialize data so the template can read it
        const posts = postData.map((post) => post.get({ plain: true }));

        // Pass serialized data and session flag into template
        res.render('homepage', {posts});
    })
  .catch ((err) => {res.status(500).json(err)})
});


router.get('/post/:id', withAuth, async (req, res) => {
  Post.findByPk(req.params.id, {
      include: [User, Comment],
    })
    .then((postData) => {
        const posts = postData.get({ plain: true });

        res.render('post', {
          posts,
          logged_in: req.session.logged_in
        });
    })
    .catch((err) => {res.status(500).json(err)});
});

// Use withAuth middleware to prevent access to route
router.get('/user/:id', withAuth, async (req, res) => {
    User.findByPk(req.params.id, {
        include: [
          {
            model: Post,
            include: [Comment],
          },
        ],
      })
      .then((userData) => {
          const user = userData.get({ plain: true });
  
          res.render('user', {
            ...user,
            logged_in: req.session.logged_in
          });
      })
      .catch((err) => {res.status(500).json(err)});
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
  
    res.render('signup');
  });

module.exports = router;