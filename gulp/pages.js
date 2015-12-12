import gulp from 'gulp';
import eslint from 'gulp-eslint';
import livereload from 'gulp-livereload';

gulp.task('pages', () =>
	gulp.src(['./pages/**/*.html'])
		.pipe(gulp.dest('./dist'))
		.pipe(livereload())
);
