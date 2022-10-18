const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
	created: {type: Date, default: Date.now},
    message: String
});

module.exports = mongoose.model('Message', messageSchema);