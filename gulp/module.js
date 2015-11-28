var gulp = require('gulp');
var babelify = require('babelify').configure({
	presets: ['es2015'],
});
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var livereload = require('gulp-livereload');

gulp.task('module:collector', ['docs'], function() {
	return browserify({
		entries: './src/collector.js',
		debug: true,
	})
		.transform(babelify)
		.bundle()
		.pipe(source('collector.js'))
		.pipe(gulp.dest('./dist'))
		.pipe(livereload());
});

gulp.task('module:linter', ['docs'], function() {
	return browserify({
		entries: './src/linter.js',
		debug: true,
	})
		.transform(babelify)
		.transform('brfs')
		.bundle()
		.pipe(source('linter.js'))
		.pipe(gulp.dest('./dist'))
		.pipe(livereload());
});

gulp.task('module:test', ['docs'], function() {
	return browserify({
		entries: './src/test.js',
		debug: true,
	})
		.transform(babelify)
		.transform('brfs')
		.bundle()
		.pipe(source('script.js'))
		.pipe(gulp.dest('./tmp/test'));
});
