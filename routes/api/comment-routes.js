const router = require('express').Router();
const { Comment, User } = require('../../models');
const withAuth = require("../../utils/auth");


router.post('/', withAuth, (req, res) => {
  console.log(req.body.post_id);
  Comment.create({
      ...req.body,
      user_id: req.session.user_id,
    })
    .then((newComment) => res.json(newComment))
    .catch ((err) => res.status(400).json(err))
});


router.put('/:id', withAuth, (req, res) => {
    Comment.update(req.body.body, {
        where: {
          id: req.params.id,
        }
      })
      .then((comments) => {
        if (!req.params.id) {
          res.status(404).json({ message: 'No comment found with that id!' });
          return;
        }
        res.json(comments)
      })
      .catch ((err) => res.status(400).json(err))
  });

router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
      where: {
        id: req.params.id,
      },
    })
    .then((comments) => {
        if (!req.params.id) {
            res.status(404).json({ message: 'No comment found with this id!' });
        }
        res.json(comments);
    })
    .catch ((err) => res.status(500).json(err))
});

module.exports = router;