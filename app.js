const express = require('express');
const mongoose = require('mongoose');
const User = require("/Users/mac1/Node.JS/Node.JS-members-only-area/models/model.js");
const bcrypt = require('bcrypt');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

const app = express(); // our server



const DBURI = 'mongodb+srv://admin:password12345@projectcluster.pdzilih.mongodb.net/MembersOnlyApp?retryWrites=true&w=majority'
mongoose.connect(DBURI).then((result) => {
}).catch(err => {console.log(err)})

app.use(express.urlencoded({ extended: false }));
app.listen(3000);
app.set('view engine', 'ejs');

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use( new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) { 
          return done(err);
        }
        if (!user) { // does not equal user
          return console.log('this is not a user'), done(null, false, { message: "Incorrect username" });
        }
        bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              // passwords match! log user in
              return console.log('passwords match'), done(null, user)
            } else {
              // passwords do not match!
              return console.log('passwords do not match'),  done(null, false, { message: "Incorrect password" })
            }
          })
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  app.get("/", (req, res) => {
    res.render("index", { user: req.user });
  });
  app.get("/members", (req, res) => {
    res.render("members");
  });
  app.post("/", passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/404"
    })
  );
  app.get("/log-out", (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });

app.get('/create', (req,res) => {
    res.render('createUser')
})
app.post('/create', (req, res) => { // create new user and password (with password hasing & salting)
    if (req.body.password === req.body.ConfirmPassword) {
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            const newUser = new User({
                username: req.body.username,
                password: hashedPassword
            })
            newUser.save()
        });
        res.redirect('/')
    } else {
        console.log('password does not match!')
    }
})



