import gulp from 'gulp';
import sassDart from 'sass';
import sassGulp from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import livereload from 'gulp-livereload';

const sass = sassGulp(sassDart);

gulp.task('styles', () =>
	gulp.src('./styles/*.sass')
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(postcss([
			autoprefixer(),
		]))
		.pipe(gulp.dest('./dist'))
		.pipe(livereload())
);
