const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserProfile = new Schema({
    username: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    idAdmin: {type: Boolean}
})
const User = mongoose.model('User', UserProfile);

const MessagePost = new Schema({
    Title: String, 
    Body: String, 
})
const Post = mongoose.model('Post', MessagePost);

const superSecretKey = new Schema({
    key: { type: Number, require: true }
})
const AccessKey = mongoose.model('AccessKey', superSecretKey) 

// const key = new AccessKey({ // make one initial save of the key 
//     key: 2969
//   })
//   key.save(AccessKey)

module.exports = {User: User, Post:Post}
