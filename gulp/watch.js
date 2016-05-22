import gulp from 'gulp';
import livereload from 'gulp-livereload';

gulp.task('watch', gulp.series('default', function watching () {
	livereload.listen();
	gulp.watch('./src/**/*.*', gulp.series('default'));
	gulp.watch('./pages/**/*.*', gulp.series('pages'));
	gulp.watch('./styles/**/*.*', gulp.series('styles'));
}));
