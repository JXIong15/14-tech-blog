const router = require('express').Router();
const { Comment } = require('../../models');

// get all comments
router.get('/', (req, res) => {
    Comment.findAll({
      include: [Comment],
    })
    .then((comments) => res.json(comments))
    .catch((err) => res.status(500).json(err))
  });
  
  // get comment according to id
  router.get('/:id', (req, res) => {
    Comment.findByPk(req.params.id, {
        include: [Comment],
    })
    .then((comments) => {
      if (!req.params.id) {
        res.status(404).json({ message: 'No comment found with that id!' });
        return;
      }
      res.json(comments)
    })
    .catch ((err) => res.status(500).json(err))
  });

router.post('/', (req, res) => {
  Comment.create({
      body: req.body.body,
      post_id: req.body.post_id,
      user_id: req.session.user_id,
    })
    .then((newComment) => res.json(newComment))
    .catch ((err) => res.status(400).json(err))
});

router.put('/:id', (req, res) => {
    Comment.update(req.body, {
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

router.delete('/:id', (req, res) => {
    Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
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