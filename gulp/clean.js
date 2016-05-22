import gulp from 'gulp';
import del from 'del';

gulp.task('clean', () =>
	del([
		'dist/*.*',
		'tmp',
	])
);
