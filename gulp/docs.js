import gulp from 'gulp';
import fs from 'fs';
import path from 'path';
import glob from 'glob';

gulp.task('docs', callback => {
	glob(path.join(__dirname, '../src/linter/**/*.md'), (err, files) => {
		if (err) {
			return;
		}
		let rootDir = path.parse(__dirname).dir;
		let data = {};
		files.forEach(file => {
			let key = file.substr(rootDir.length + 1, file.length - 4 - rootDir.length).split(path.sep);
			key.shift();
			key.shift();
			key = key.join('.');
			data[key] = fs.readFileSync(file, 'utf-8');
		});
		data = JSON.stringify(data);
		let tmpDir = path.join(rootDir, 'tmp');
		if (!fs.existsSync(tmpDir)) {
			fs.mkdir(tmpDir);
		}
		fs.writeFileSync(path.join(tmpDir, 'docs.json'), data);
		callback();
	});
});
