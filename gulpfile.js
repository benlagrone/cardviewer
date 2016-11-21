var gulp = require('gulp'),
    connect = require('gulp-connect');
//livereload = require('gulp-livereload');

gulp.task('connect', function(){
    connect.server({
        port:3001,
        host:'localhost',
        fallback:'index.html',
        // livereload:'false'
    })
});

gulp.task('reload',function(){
    gulp.src(['./'])
    .pipe(connect.reload())
});
gulp.task('default',['connect']);