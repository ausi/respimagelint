import gulp from 'gulp';
import babelify from 'babelify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import livereload from 'gulp-livereload';

gulp.task('module:collector', () =>
	browserify({
		entries: './src/collector.js',
		//debug: true,
	})
		.transform(babelify)
		.transform('brfs')
		.transform({global: true}, 'uglifyify')
		.bundle()
		.pipe(source('collector.js'))
		.pipe(gulp.dest('./dist'))
		.pipe(livereload())
);

gulp.task('module:linter', () =>
	browserify({
		entries: './src/linter.js',
		//debug: true,
	})
		.transform(babelify)
		.transform('brfs')
		.transform({global: true}, 'uglifyify')
		.bundle()
		.pipe(source('linter.js'))
		.pipe(gulp.dest('./dist'))
		.pipe(livereload())
);

gulp.task('module:store', () =>
	browserify({
		entries: './src/store.js',
		//debug: true,
	})
		.transform(babelify)
		.transform('brfs')
		.transform({global: true}, 'uglifyify')
		.bundle()
		.pipe(source('store.js'))
		.pipe(gulp.dest('./dist'))
		.pipe(livereload())
);

gulp.task('module:test', () =>
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
