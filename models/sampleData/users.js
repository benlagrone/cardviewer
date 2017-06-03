var User = require('../user');

User.find(function(err, user) {
    if (!user) {

        var exec1 = User({
            name: 'jack exec user1',
            role: '584f718c83f71e14da459058',
            active: true,
            creationDate: new Date(),
        });
        exec1.save(function(err) {
            if (err) throw err;
            console.log('User created!');
        });
        var manager1 = User({
            name: 'jack manager',
            role: '584f718c83f71e14da459058',
            active: true,
            creationDate: new Date(),
        });
        manager1.save(function(err) {
            if (err) throw err;
            console.log('User created!');
        });
        var manager2 = User({
            name: 'jack user1',
            role: '584f718c83f71e14da459058',
            active: true,
            creationDate: new Date(),
        });
        manager2.save(function(err) {
            if (err) throw err;
            console.log('User created!');
        });
        var candidate1 = User({
            name: 'jack candidate user1',
            role: '584f718c83f71e14da459055',
            active: true,
            creationDate: new Date(),
        });
        candidate1.save(function(err) {
            if (err) throw err;
            console.log('User created!');
        });

        var candidate2 = User({
            name: 'jack user1',
            role: '584f718c83f71e14da459058',
            active: true,
            creationDate: new Date(),
        });
        candidate2.save(function(err) {
            if (err) throw err;
            console.log('User created!');
        });
        var candidate3 = User({
            name: 'jack user1',
            role: '584f718c83f71e14da459058',
            active: true,
            creationDate: new Date(),
        });
        candidate3.save(function(err) {
            if (err) throw err;
            console.log('User created!');
        });
        var candidate4 = User({
            name: 'joe user2',
            role: '584f718c83f71e14da459058',
            active: true,
            creationDate: new Date(),
        });
        candidate4.save(function(err) {
            if (err) throw err;
            console.log('User created!');
        });
        var candidate5 = User({
            name: 'george user3',
            role: '584f718c83f71e14da459058',
            active: true,
            creationDate: new Date(),
        });
        candidate5.save(function(err) {
            if (err) throw err;
            console.log('User created!');
        });
        var administrator1 = User({
            name: 'jonny user4',
            role: '584f718c83f71e14da459054',
            active: true,
            creationDate: new Date(),
        });
        administrator1.save(function(err) {
            if (err) throw err;
            console.log('User created!');
        });

        var team1 = User({
            name: 'freddy user5',
            role: '584ced0b1c0a7b3015d0e022',
            active: true,
            creationDate: new Date(),
        });
        team1.save(function(err) {
            if (err) throw err;
            console.log('User created!');
        });
        var team2 = User({
            name: 'freddy user5',
            role: '584ced0b1c0a7b3015d0e022',
            active: true,
            creationDate: new Date(),
        });
        team2.save(function(err) {
            if (err) throw err;
            console.log('User created!');
        });

        var team3 = User({
            name: 'freddy user5',
            role: '584ced0b1c0a7b3015d0e022',
            active: true,
            creationDate: new Date(),
        });
        team3.save(function(err) {
            if (err) throw err;
            console.log('User created!');
        });
        var team4 = User({
            name: 'freddy user5',
            role: '584ced0b1c0a7b3015d0e022',
            active: true,
            creationDate: new Date(),
        });
        team4.save(function(err) {
            if (err) throw err;
            console.log('User created!');
        });
    }

});