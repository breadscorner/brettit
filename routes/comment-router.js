const express = require("express");
let commentRouter = express.Router();
const db = require('../fake-db');

commentRouter
  .get("comments/show/:commentid", (req, res) => {
    if (!req.session.userId) {
      res.redirect('/login');
      return;
    }
    const postingId = req.params.postingId;
    const posting = db.getPostingById(postingId);

  })

// Do later
commentRouter
  .post("comments/reply/:commentid", (req, res) => {

  })

commentRouter
  .route("comments/edit/:commentid")
  .get((req, res) => {

  })
  .post((req, res) => {

  })

commentRouter
  .post("/deleteconfirm/:commentid", (req, res) => {

  })

commentRouter
  .post("/delete/:commentid", (req, res) => {
    const commentid = req.params.commentid;
    const postId = req.body.postid;
    console.log(commentid);
    db.deleteComment(commentid);
    res.redirect(`/posts/show/${postId}`);
  })

module.exports = commentRouter;