// app/models/Question.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var QuestionSchema   = new Schema({
    name: String,
    questiontext: String,
    group:String,
    author:String,
    type:String,
    weight:String,
    assessment:String
});

module.exports = mongoose.model('Question', QuestionSchema);