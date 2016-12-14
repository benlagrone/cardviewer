// app/models/Question.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var QuestionSchema   = new Schema({
    description: String,
    questiontext: String,
    group:String,
    author:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    weight:String,
    answer:String,
    active:Boolean,
    creationDate:Date,
    type:String,
    answer1:String,
    answer2:String,
    answer3:String,
    answer4:String
});

module.exports = mongoose.model('Question', QuestionSchema);
