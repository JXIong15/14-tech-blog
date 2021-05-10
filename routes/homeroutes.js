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


router.get('/api/post/:id', withAuth, async (req, res) => {
  Post.findByPk(req.params.id, {
      include: [User, {
          model: Comment,
          include: [User],
          where: {
              post_id: req.params.id,
          }
      }],
    })
    .then((postData) => {
        if (!postData) {
            res.status(404).json({ message: 'No post found with that id' });
            return;
        }
        const posts = postData.get({ plain: true });

        res.render('post', {
          posts,
          loggedIn: true
        });
    })
    .catch((err) => {res.status(500).json(err)});
});

// Use withAuth middleware to prevent access to route
router.get('/api/user/:id', withAuth, async (req, res) => {
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
            user,
            loggedIn: req.session.loggedIn
          });
      })
      .catch((err) => {res.status(500).json(err)});
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
  
    res.render('signup');
  });

module.exports = router;