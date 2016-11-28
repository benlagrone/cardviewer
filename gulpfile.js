var gulp = require('gulp'),
    connect = require('gulp-connect');

gulp.task('connect', function() {
    connect.server({
        name:'Test App',

        port:3001,
        livereload:true
    });
});

gulp.task('default', ['connect']);