const express = require('express');
const mongoose = require('mongoose');
const User = require("/Users/mac1/Node.JS/Node.JS-members-only-area/models/model.js");
const bcrypt = require('bcrypt');




const app = express(); // our server

app.listen(3000);
app.set('view engine', 'ejs');
app.use(express.urlencoded());

const DBURI = 'mongodb+srv://admin:password12345@projectcluster.pdzilih.mongodb.net/MembersOnlyApp?retryWrites=true&w=majority'
mongoose.connect(DBURI).then((result) => {
    console.log(result)
}).catch(err => {console.log(err)})

app.get('/', (req, res) => {
    res.render('index')
})
app.get('/create', (req,res) => {
    res.render('createUser')
})
app.post('/create', (req, res) => {
    bcrypt.hash(req.body.Password, 10, (err, hashedPassword) => {
        const newUser = new User({
            Username: req.body.Username,
            Password: hashedPassword
        })
        newUser.save()
    });
})

