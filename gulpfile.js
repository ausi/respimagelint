/*global require*/
var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var eslint = require('gulp-eslint');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var runSequence = require('run-sequence');
var livereload = require('gulp-livereload');

gulp.task('docs', function(callback) {
	glob(__dirname + '/src/linter/**/*.md', function(err, files) {
		var data = {};
		files.forEach(function(file) {
			var key = file.substr(__dirname.length + 1, file.length - 4 - __dirname.length).split(path.sep);
			key.shift();
			key.shift();
			key = key.join('.');
			data[key] = fs.readFileSync(file, 'utf-8');
		});
		data = JSON.stringify(data);
		if (!fs.existsSync(__dirname + '/tmp')) {
			fs.mkdir(__dirname + '/tmp');
		}
		fs.writeFileSync(__dirname + '/tmp/docs.json', data);
		callback();
	});
});

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
		.transform('brfs')
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
	return runSequence('lint', 'docs', ['module:collector', 'module:linter'], callback);
});

gulp.task('watch', ['default'], function() {
	livereload.listen();
	gulp.watch('./src/**/*.js', ['default']);
});
