const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const sequelize = require("../config/connection");
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
        }
      ],
    //   where: {
    //       user_id: req.session.user_id,
    //   }
    })
    .then((postData) => {
        // Serialize data so the template can read it
        const posts = postData.map((post) => post.get({ plain: true }));

        // Pass serialized data and session flag into template
        res.render('dashboard', {posts, loggedIn: true});
    })
  .catch ((err) => {res.status(500).json(err)})
});

// makes new post
router.get('/create', withAuth, (req, res) => {
  Post.findAll({
    include: [User,
      {
        model: Comment,
        include: [User],
      },
    ],
  //   where: {
  //       user_id: req.session.user_id,
  //   }
  })
  .then((postData) => {
      // Serialize data so the template can read it
      const posts = postData.map((post) => post.get({ plain: true }));

      // Pass serialized data and session flag into template
      res.render('new-post', {posts, loggedIn: true});
  })
.catch ((err) => {res.status(500).json(err)})
});

module.exports = router;