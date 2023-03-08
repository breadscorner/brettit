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
  .get("/edit/:commentid", (req, res) => {
    const commentId = req.params.commentid;
    const comment = db.getCommentById(commentId)
    res.render("comments/edit-comment", { id: commentId, comment})
  })
  .post("/edit/:commentid", (req, res) => {
    const commentid = req.params.commentid;
    const description = req.body.description; // bye
    const postId = db.getCommentById(commentid).post_id;
    db.editComment(commentid, description);
    res.redirect(`/posts/show/${postId}`);
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