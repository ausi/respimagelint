var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('default', function (callback) {
	return runSequence('lint', 'docs', ['module:collector', 'module:linter'], callback);
});
