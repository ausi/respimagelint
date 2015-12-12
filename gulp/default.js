import gulp from 'gulp';
import runSequence from 'run-sequence';

gulp.task('default', callback =>
	runSequence('lint', ['styles', 'pages', 'module:collector', 'module:linter', 'module:store'], callback)
);
