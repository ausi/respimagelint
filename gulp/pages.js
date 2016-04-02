import gulp from 'gulp';
import fs from 'fs';
import path from 'path';
import eslint from 'gulp-eslint';
import livereload from 'gulp-livereload';
import replace from 'gulp-replace';
import uglify from 'uglify-js';

gulp.task('pages', () =>
	gulp.src(['./pages/**/*.html'])
		.pipe(replace(
			'{{> bookmarklet}}',
			'javascript:(function(){' + encodeURIComponent(uglify.minify(
				path.join(__dirname, '..', 'src', 'bookmarklet.js')
			).code) + '})()'
		))
		.pipe(gulp.dest('./dist'))
		.pipe(livereload())
);
