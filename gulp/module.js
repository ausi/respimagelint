import gulp from 'gulp';
import babelify from 'babelify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import livereload from 'gulp-livereload';

gulp.task('module:collector', ['docs'], () =>
	browserify({
		entries: './src/collector.js',
		debug: true,
	})
		.transform(babelify)
		.bundle()
		.pipe(source('collector.js'))
		.pipe(gulp.dest('./dist'))
		.pipe(livereload())
);

gulp.task('module:linter', ['docs'], () =>
	browserify({
		entries: './src/linter.js',
		debug: true,
	})
		.transform(babelify)
		.transform('brfs')
		.bundle()
		.pipe(source('linter.js'))
		.pipe(gulp.dest('./dist'))
		.pipe(livereload())
);

gulp.task('module:store', () =>
	browserify({
		entries: './src/store.js',
		debug: true,
	})
		.transform(babelify)
		.bundle()
		.pipe(source('store.js'))
		.pipe(gulp.dest('./dist'))
		.pipe(livereload())
);

gulp.task('module:test', ['docs'], () =>
	browserify({
		entries: './src/test.js',
		debug: true,
	})
		.transform(babelify)
		.transform('brfs')
		.bundle()
		.pipe(source('script.js'))
		.pipe(gulp.dest('./tmp/test'))
);
