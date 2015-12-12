import gulp from 'gulp';
import livereload from 'gulp-livereload';

gulp.task('watch', ['default'], () => {
	livereload.listen();
	gulp.watch('./src/**/*.*', ['default']);
	gulp.watch('./pages/**/*.*', ['pages']);
	gulp.watch('./styles/**/*.*', ['styles']);
});
