// app/models/Assessment.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AssessmentBuildSchema   = new Schema({
    assessment:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Assessment'
    }],
    question:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question'
    }],
    child:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question'
    }],
    answer1Child:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question'
    }],
    answer2Child:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question'
    }],
    answer3Child:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question'
    }],
    answer4Child:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question'
    }],
});

module.exports = mongoose.model('AssessmentBuild', AssessmentBuildSchema);