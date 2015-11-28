import gulp from 'gulp';
import livereload from 'gulp-livereload';

gulp.task('watch', ['default'], () => {
	livereload.listen();
	gulp.watch('./src/**/*.js', ['default']);
});
