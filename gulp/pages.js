import gulp from 'gulp';
import eslint from 'gulp-eslint';

gulp.task('pages', () =>
	gulp.src(['./pages/**/*.html'])
		.pipe(gulp.dest('./dist'))
);
