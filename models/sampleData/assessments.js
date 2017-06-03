var Assessment = require('../assessment');

Assessment.find(function(err, assessment) {
    if (!assessment) {
        var assessment1 = Assessment({
            name: 'Manager 1',
            group: 'Developers',
            active: true,
            creationDate: new Date(),
            author: '584f718c83f71e14da459058',
            type: 'multiple choice',
        });
        assessment1.save(function(err) {
            if (err) throw err;
            console.log('assessment1 created!');
        });
        var assessment2 = Assessment({
            name: 'Programmer 1',
            group: 'Developers',
            active: true,
            creationDate: new Date(),
            author: '584f718c83f71e14da459058',
            type: 'multiple choice',
        });
        assessment2.save(function(err) {
            if (err) throw err;
            console.log('assessment1 created!');
        });
        var assessment3 = Assessment({
            name: 'Programmer 2',
            group: 'Developers',
            active: true,
            creationDate: new Date(),
            author: '584f718c83f71e14da459058',
            type: 'multiple choice',
        });
        assessment3.save(function(err) {
            if (err) throw err;
            console.log('assessment1 created!');
        });
        var assessment4 = Assessment({
            name: 'Programmer 3',
            group: 'Developers',
            active: true,
            creationDate: new Date(),
            author: '584f718c83f71e14da459058',
            type: 'multiple choice',
        });
        assessment4.save(function(err) {
            if (err) throw err;
            console.log('assessment1 created!');
        });
        var assessment5 = Assessment({
            name: 'Programmer 4',
            group: 'Developers',
            active: true,
            creationDate: new Date(),
            author: '584f718c83f71e14da459058',
            type: 'multiple choice',
        });
        assessment5.save(function(err) {
            if (err) throw err;
            console.log('assessment1 created!');
        });
    }
});