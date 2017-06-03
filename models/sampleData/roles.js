var Role = require('../role');
var Role1 = Role({
    name: 'administrator',
});
var Role2 = Role({
    name: 'candidate',
});

var Role3 = Role({
    name: 'manager',
});

var Role4 = Role({
    name: 'team',
});
var Role5 = Role({
    name: 'exec',
});

Role.find(function(err, role) {
    if (!role) {
        Role1.save(function(err) {
            if (err) throw err;
            console.log('role created!');
        });
        Role2.save(function(err) {
            if (err) throw err;
            console.log('role created!');
        });
        Role3.save(function(err) {
            if (err) throw err;
            console.log('role created!');
        });
        Role4.save(function(err) {
            if (err) throw err;
            console.log('role created!');
        });
        Role5.save(function(err) {
            if (err) throw err;
            console.log('role created!');
        });
    }
});