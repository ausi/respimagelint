var gulp = require('gulp');
var livereload = require('gulp-livereload');

gulp.task('watch', ['default'], function() {
	livereload.listen();
	gulp.watch('./src/**/*.js', ['default']);
});
