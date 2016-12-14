// app/models/User.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    name: String,
    role: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Role'
    }],
    active:Boolean,
    creationDate:Date
});

module.exports = mongoose.model('User', UserSchema);