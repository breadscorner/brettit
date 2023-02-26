const express = require("express");
let postRouter = express.Router();
const db = require('../fake-db');


// global variables
let users = db.users;

postRouter
  .get("/deleteconfirm/:postid", (req, res) => {
    const postid = req.params.postid;
    const post = db.getPost(postid);
    res.render("posts/delete-post", { post });
  })

postRouter
  .post("/delete/:postid", (req, res) => {
    const postid = req.params.postid;
    db.deletePost(postid);
    res.redirect("/");
  })

// Posts
postRouter
  .get("/show/:postid", (req, res) => {
    const loggedInUsername = req.session.username; // uname
    const postid = req.params.postid;
    const post = db.getPost(postid);
    const postCreator = post.creator.uname;
    const canModify = loggedInUsername === postCreator;
    const date = new Date(post.timestamp);
    const message = req.query.message;
    const vote = db.getVote(post.creator.id, postid);
    res.render("posts/post-show", {
      postid: postid,
      post: post,
      date: date,
      users: users,
      canModify,
      message: message,
      vote: vote,
    });
  })

postRouter
  .route("/create")
  .get((req, res) => {
    res.render("posts/create-post")
  })
  .post((req, res) => {
    const title = req.body.title
    const link = req.body.link
    const creator = db.getUserByUsername(req.session.username).id
    const description = req.body.description
    const subgroup = req.body.category
    const create = db.addPost(title, link, creator, description, subgroup)
    res.redirect(`/posts/show/${create.id}`)
  })

postRouter
  .route("/edit/:postid")
  .get((req, res) => {
    const postid = req.params.postid;
    const post = db.getPost(postid);
    const date = new Date(post.timestamp);
    res.render("posts/edit-post", {
      postid: postid,
      post: post,
      date: date,
      users: users
    });
  })
  .post((req, res) => {
    let postid = req.params.postid

    let changes = {
      title: req.body.title,
      link: req.body.link,
      description: req.body.description,
      subgroup: req.body.subgroup,
    }
    db.editPost(postid, changes)
    res.redirect(`/posts/show/${postid}`)
  });

postRouter
  .get("/post/delete-post", (req, res) => {
    const deletePost = db.deletePost();
    res.render(deletePost)
  })

postRouter
  .post("/posts/delete/:postid", (req, res) => {
    if (!post) {
      res.redirect("post/:postid")
    }
    res.redirect("subs/subs-show/:subname")
  });

postRouter
  .post("/comment-create/:postid", (req, res) => {
    const postid = req.params.postid
    const user = req.session.username
    const creator = db.getUserByUsername(user).id
    const description = req.body.description
    db.addComment(postid, creator, description)
    res.redirect(`/posts/show/${postid}`)
  })

// Vote
postRouter
  .post("/vote/:postid", (req, res) => {
    const postid = req.params.postid;
    const user = db.getUserByUsername(req.session.username);
    const newValue = req.body.vote;

    if (user) {
      let voteObject = db.getVote(user.id, postid);

      if (voteObject) {
        voteObject.value = newValue;
      } else {
        voteObject = db.createVote(user.id, postid, newValue);
      }
    }
    res.redirect(`/posts/show/${postid}`);
  });

module.exports = postRouter;


