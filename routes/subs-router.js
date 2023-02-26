const express = require("express");
let subsRouter = express.Router();
const db = require('../fake-db');

const app = express();

// Global variables
let users = db.users;

// Subs
subsRouter
  .get("/list", (req, res) => {
    let sub = [];
    let posts = db.getPosts();
    for (const post of posts) {
      if (!sub.includes(post.subgroup)) {
        sub.push(post.subgroup)
      }
    }
    res.render("subs/subs-list", {
      sub: sub
    })
  });

subsRouter
  .get("/subs-show/:subname", (req, res) => {
    let subname = req.params.subname;
    let originalPosts = db.getPosts();
    let posts = [];
    
    for (const post of originalPosts) {
      const user = db.getUser(post.creator);
      const postClone = structuredClone(post);
      postClone.username = user.uname
      posts.push(postClone);
    }

    res.render("subs/subs-show", {
      posts: posts,
      subname: subname,
    })
  });

module.exports = subsRouter;