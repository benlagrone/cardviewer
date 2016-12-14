// app/models/Assessment.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AssessmentSchema   = new Schema({
    name: String,
    group:String,
    author:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],,
    target:String,
    description:String,
    active:Boolean,
    creationDate:Date
});

module.exports = mongoose.model('Assessment', AssessmentSchema);