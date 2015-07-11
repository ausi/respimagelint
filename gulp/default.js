var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('default', function (callback) {
	return runSequence('lint', ['module:collector', 'module:linter'], callback);
});
