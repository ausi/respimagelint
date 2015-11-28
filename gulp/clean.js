import gulp from 'gulp';
import del from 'del';

gulp.task('clean', cb => {
	del([
		'dist',
		'tmp',
	], cb);
});
