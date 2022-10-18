const mongoose = require('mongoose'),
passportLocalMongoose = require('passport-local-mongoose');

const messageSchema = new mongoose.Schema({
	created: {type: Date, default: Date.now},
    message: String
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    messages: [messageSchema]
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);