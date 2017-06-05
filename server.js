var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

mongoose.connect('mongodb://localhost:27017/talent')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.configure(function() {
app.use(allowCrossDomain);
//some other code
// });


var port = process.env.port || 8080;

var router = express.Router();

var Role = require('./models/role');
var Roles = require('./models/sampleData/roles');
var User = require('./models/user');
var Users = require('./models/sampleData/users');
var Question = require('./models/question');
var Questions = require('./models/sampleData/questions');
var QuestionLibrary = require('./models/questionlibrary');
var QuestionLibraries = require('./models/sampleData/questionlibraries');
var Category = require('./models/category');
var Categories = require('./models/sampleData/categories');
var Assessment = require('./models/assessment');
var Assessments = require('./models/sampleData/assessments');
router.use(function(req, res, next) {
    console.log('something foobar');
    next();
});
router.get('/', function(req, res) {
    res.json({ message: 'hooray' });
});

router.route('/questionlibrary')
    .post(function(req, res) {
        var questionlibrary = new QuestionLibrary();
        questionlibrary.name = req.body.name;

        questionlibrary.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'questionlibrary created' });
        })
    })
    .get(function(req, res) {
        QuestionLibrary.find(function(err, questionlibraries) {
            if (err)
                res.send(err);
            res.json(questionlibraries);
        });
    });

router.route('questionlibrary/:questionlibrary_id')
    .get(function(req, res) {
        QuestionLibrary.findById(req.params.questionlibrary_id, function(err, questionlibrary) {
            if (err)
                res.send(err);
            res.json(questionlibrary);
        })
    })
    .put(function(req, res) {
        QuestionLibrary.findById(req.params.questionlibrary_id, function(err, questionlibrary) {
            if (err)
                res.send(err);
            questionlibrary.name = req.body.name;
            questionlibrary.description
            source,
            category,
            questionlibrary.save(function(err) {
                if (err)
                    res.send(err)
                res.json({ message: 'questionlibrary updated' });
            });
        });
    })
    .delete(function(eq, res) {
        QuestionLibrary.remove({
            _id: req.params.questionlibrary_id
        }, function(err, questionlibrary) {
            if (err)
                res.send(err)

            res.json({ message: 'Deleted success' });
        });
    });

router.route('/category')
    .post(function(req, res) {
        var category = new Category();
        category.name = req.body.name;

        category.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'category created' });
        })
    })
    .get(function(req, res) {
        Category.find(function(err, category) {
            if (err)
                res.send(err);
            res.json(category);
        });
    });

router.route('/question')
    .post(function(req, res) {
        var question = new Questions();
        question.name = req.body.name;

        question.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'question created' });
        })
    })
    .get(function(req, res) {
        Question.find(function(err, question) {
            if (err)
                res.send(err);
            res.json(question);
        });
    });

router.route('/question/:question_id')
    .get(function(req, res) {
        Question.findById(req.params.question_id, function(err, question) {
            if (err)
                res.send(err);
            res.json(question);
        })
    })
    .put(function(req, res) {
        Question.findById(req.params.question_id, function(err, question) {
            if (err)
                res.send(err);
            question.name = req.body.name;

            question.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'question updated!' });
            });
        });
    })
    .delete(function(req, res) {
        Question.remove({
            _id: req.params.question_id
        }, function(err, question) {
            if (err)
                res.send(err)

            res.json({ message: 'Successfully Delete question' });
        });
    });

router.route('/assessment')
    .post(function(req, res) {
        var assessment = new Assessment();
        assessment.name = req.body.name;

        assessment.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'question created' });
        })
    })
    .get(function(req, res) {
        Assessment.find(function(err, question) {
            if (err)
                res.send(err);
            res.json(question);
        });
    });

router.route('/assessment/:assessment_id')
    .get(function(req, res) {
        Assessment.findById(req.params.assessment_id, function(err, assessment) {
            if (err)
                res.send(err);
            res.json(assessment);
        })
    })
    .put(function(req, res) {
        Assessment.findById(req.params.assessment_id, function(err, assessment) {
            if (err)
                res.send(err);
            assessment.name = req.body.name;

            assessment.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'assessment updated!' });
            });
        });
    })
    .delete(function(req, res) {
        Assessment.remove({
            _id: req.params.assessment_id
        }, function(err, assessment) {
            if (err)
                res.send(err)

            res.json({ message: 'Successfully Delete assessment' });
        });
    });

router.route('/user')
    .post(function(req, res) {
        var user = new User();
        user.name = req.body.name;

        user.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'user created' });
        })
    })
    .get(function(req, res) {
        User.find(function(err, user) {
            console.log(user)
            if (err)
                res.send(err);
            res.json(user);
        });
    });

router.route('/user/:user_id')
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })
    .put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            user.name = req.body.name;

            user.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'user updated!' });
            });
        });
    })
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err)

            res.json({ message: 'Successfully Delete user' });
        });
    });

router.route('/role')
    .post(function(req, res) {
        var role = new Role();
        role.name = req.body.name;

        role.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'role created' });
        })
    })
    .get(function(req, res) {
        Role.find(function(err, role) {
            if (err)
                res.send(err);
            res.json(role);
        });
    });

router.route('/role/:role_id')
    .get(function(req, res) {
        Role.findById(req.params.role_id, function(err, role) {
            if (err)
                res.send(err);
            res.json(role);
        });
    })
    .put(function(req, res) {
        Role.findById(req.params.role_id, function(err, role) {
            if (err)
                res.send(err);
            role.name = req.body.name;

            role.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'role updated!' });
            });
        });
    })
    .delete(function(req, res) {
        Role.remove({
            _id: req.params.role_id
        }, function(err, role) {
            if (err)
                res.send(err)

            res.json({ message: 'Successfully Delete role' });
        });
    });

app.use('/api', router);

app.listen(port);

console.log('magic happens on port ' + port);