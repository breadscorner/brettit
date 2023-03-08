// Import libraries
const express = require("express");
const bodyParser = require("body-parser")
const cookieSession = require("cookie-session");
const app = express();
const db = require("./fake-db");
const path = require("path");

// App configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  res.locals.debug = (item) => JSON.stringify(item, null, 2);
  next();
})

// Global middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false })); //Need better understanding of this
app.use(bodyParser.json())

// Cookie handling
app.use(cookieSession({
  name: "session",
  keys: ["secret"],
  // httpOnly: true,
  // secure: true,
  maxAge: 24 * 60 * 60 * 1000,
}))

// Require routes.js
const postRouter = require("./routes/post-router");
const subsRouter = require("./routes/subs-router");
const commentRouter = require("./routes/comment-router");

// Mount routes on paths
app.use("/posts", postRouter);
app.use("/subs", subsRouter);
app.use("/comments", commentRouter);

// Home
app
  .get('/', (req, res) => {
    const order = req.query.order; // oldest newest largest smallest
    let username = req.session.username;
    let originalPosts = db.getPosts(20, undefined, order);
    let posts = [];

    for (const post of originalPosts) {
      const user = db.getUser(post.creator);
      const postClone = structuredClone(post);
      postClone.username = user.uname
      posts.push(postClone);
    }

    res.render("main/home", {
      user: username,
      posts: posts,
    });
  });

// Login
app
  .route("/login")
  .get((req, res) => {
    res.render("main/login", {});
  })
  .post((req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    const user = db.getUserByUsername(username);
    if (user && user.password !== password) {
      res.redirect("/login");
    } else {
      req.session.username = username;
      delete user["password"];
      res.redirect("/");
    }
  });

// Sign up  
app
  .route("/sign-up")
  .get((req, res) => {
    res.render("main/sign-up", {});
  })
  .post((req, res) => {
    const newUser = db.addUser(req.body.username, req.body.password)
    console.log(newUser)
    res.redirect("/login")
  })

// Logout
app
  .post("/logout", (req, res) => {
    req.session.username = null;
    res.redirect('/login');
  });

// Debugging
app
  .get("/debug", (req, res) => {
    // See if you can figure out what this route is for.
    // I used it to display information in the console to know if certain functions were actually working.
    // Are you clever enough to benefit from it? Yes
    // Did you even read this comment? Yes
    db.debug();
    res.redirect("/")
  });

// Port handling
const PORT = 8000;
app.listen(PORT, () => console.log(`server should be running at http://localhost:${PORT}/`))