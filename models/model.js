const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserProfile = new Schema({
    Username: {type: String, require: true},
    Password: {type: String, require: true}
})
const User = mongoose.model('User', UserProfile);

const MessagePost = new Schema({
    Title: String, 
    Body: String, 
})
const Post = mongoose.model('Post', MessagePost);

module.exports = Post;
module.exports = User;
