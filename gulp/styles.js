import gulp from 'gulp';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import livereload from 'gulp-livereload';


gulp.task('styles', () =>
	gulp.src('./styles/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([
			autoprefixer(),
		]))
		.pipe(gulp.dest('./dist'))
		.pipe(livereload())
);
