/*global require*/
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var runSequence = require('run-sequence');
var livereload = require('gulp-livereload');

gulp.task('module:collector', function() {
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

gulp.task('module:linter', function() {
	return browserify({
		entries: './src/linter.js',
		debug: true,
	})
		.transform(babelify)
		.bundle()
		.pipe(source('linter.js'))
		.pipe(gulp.dest('./dist'))
		.pipe(livereload());
});

gulp.task('lint', function() {
	return gulp.src(['./src/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format());
});

gulp.task('default', function (callback) {
	return runSequence('lint', ['module:collector', 'module:linter'], callback);
});

gulp.task('watch', ['default'], function() {
	livereload.listen();
	gulp.watch('./src/**/*.js', ['default']);
});
