// app/models/Assessment.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AssessmentSchema   = new Schema({
    name: String,
    group:String,
    author:String,
    questions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question'
    }]
});

module.exports = mongoose.model('Assessment', AssessmentSchema);