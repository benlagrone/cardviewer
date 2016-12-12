// app/models/QuestionLibrary.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var QuestionLibrarySchema   = new Schema({
    name: String,
    description: String,
    source:String,
    category:String,
    questions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question'
    }]
});

module.exports = mongoose.model('QuestionLibrary', QuestionLibrarySchema);