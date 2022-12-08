require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const {User, AccessKey} = require("/Users/mac1/Node.JS/Node.JS-members-only-area/models/model.js");
const bcrypt = require('bcrypt');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const { json } = require('express/lib/response');
var jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')


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
app.use(express.json());
app.use(cookieParser());

passport.use( new LocalStrategy((username, password, done) => { // login validator 
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
    }));
    const maxAge = 3 * 24 * 60 * 60 // 3 days
    const createToken = (id) => {
      return jwt.sign({ id }, 'SUPERSECRETKEY', {
        expiresIn: maxAge
      })
    }


    const requireAuth = (req,res,next) => { // secured route for users that have signed up only!
      const token = req.cookies.jwt
      //check if token exists
      if (token) { // if (token) means if the token is true. The token is true when one exists
        jwt.verify(token, 'SUPERSECRETKEY', (err, decodedToken) => {
          if (err) {
            res.redirect('/')
            console.log(err)
          } else {
            console.log(decodedToken)
            next();
          } 
        })
       } else {
          res.redirect('/')
       }
    }

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  app.get("/", (req, res) => {
    res.render("index", { user: req.body.user })
  });
  
    // const tokenCreate = createToken(user)

  app.post("/", passport.authenticate("local", {failureRedirect: '/404'}),
     function(req, res) {
       res.clearCookie('jwt'); // clear initial jwt cookie
       res.cookie('jwt', createToken(User._id), {httpOnly: true, maxAge: maxAge * 1000}) // create jwt cookie
       res.redirect('/postsignuppage')
       // navigate to here after successful login
    });

  app.get("/log-out", (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.clearCookie('jwt');
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
            newUser.save() // save to db
        });
        res.cookie('jwt', createToken(User._id), {httpOnly: true, maxAge: maxAge * 1000})
        res.render('members', {user: User.username});
    } else {
        res.alert('Password does not match!')
        res.redirect('/create')
    }
})

app.get("/members", requireAuth, (req, res) => {
  res.render("members");
});
app.get('/postsignuppage', (req,res) => {
  res.render('postsignup', {user: req.user})
})
app.post('/members-only', (req,res) => {
  console.log(req.body.password)
  if (req.body.password == 2969) {
      res.redirect('/members')
  } 
})


