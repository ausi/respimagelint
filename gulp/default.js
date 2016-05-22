import gulp from 'gulp';
import lint from './lint';
import docs from './docs';
import styles from './styles';
import pages from './pages';
import module from './module';

gulp.task('default', gulp.series(
	'lint',
	'docs',
	gulp.parallel(
		'styles',
		'pages',
		'module:collector',
		'module:linter',
		'module:store'
	)
));
