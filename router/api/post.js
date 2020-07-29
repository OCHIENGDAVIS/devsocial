const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Post = require('../../models/post');
const Profile = require('../../models/profile');
const User = require('../../models/User');
const postRouter = express.Router();

// CREATIG POST
postRouter.post(
  '/api/post',
  [auth, [check('text', 'text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const newPost = {
        text: req.body.text,
        name: user.name,
        avatar: req.avatar,
        user: req.user.id,
      };
      const post = await new Post(newPost).save();
      res.status(201).send(post);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ err });
    }
  }
);

// comment on a post
postRouter.post(
  '/api/post/comment/:id',
  [auth, [check('text', 'text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: req.avatar,
        user: req.user.id,
      };
      post.comments.unshift(newComment);
      await post.save();

      const createPost = await new Post(newComment).save();
      res.status(201).send(createPost);
    } catch (err) {
      console.log(err);
      res.status(500).send({ err });
    }
    res.send('post route');
  }
);

// delete a comment
postRouter.delete('/api/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      res.status(404).send({ message: 'comment not found' });
    }
    if (comment.user.toString() !== req.user.id) {
      res.status(401).send('user unauthorised');
    }
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    res.status(200).send(post.comments);
  } catch (err) {
    console.log(err);
    res.status(500).send({ err });
  }
});

// get all posts
postRouter.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).send(posts);
  } catch (err) {
    console.log(err);
    res.status(500).send({ err });
  }
});
// GET a post
postRouter.get('/api/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send({ message: 'not found' });
    }
    res.status(200).send(post);
  } catch (err) {
    console.log(err);
    if (err.kind == 'ObjectId') {
      return res.send({ message: 'not object id' });
    }
    return res.status(500).send({ err });
  }
});
// DELETE a single post
postRouter.delete('/api/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).send({ message: 'not found' });
    }
    if (post.user.toString() !== req.user.id) {
      res.status(401).send({ message: 'forbidden' });
    }
    await post.remove();
    res.status(200).send();
  } catch (err) {
    console.log(err);
    if (err.kind == 'ObjectId') {
      return res.send({ message: 'not found' });
    }
    res.status(500).send({ err });
  }
});
postRouter.put('/api/posts/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send({ message: 'not found' });
    }
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).send({ message: 'already liked' });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.status(200).send(post.likes);
  } catch (err) {
    console.log(err);
    if (err.kind == 'ObjectId') {
      return res.send({ message: 'not found' });
    }
    res.status(500).send();
  }
});
postRouter.put('/api/posts/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send({ message: 'not found' });
    }
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).send({ message: 'not yet liked' });
    }
    // Get A reomve index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.status(200).send(post.likes);
  } catch (err) {
    console.log(err);
    if (err.kind == 'ObjectId') {
      return res.send({ message: 'not found' });
    }
    res.status(500).send();
  }
});
module.exports = postRouter;
