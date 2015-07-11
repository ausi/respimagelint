var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var glob = require('glob');

gulp.task('docs', function(callback) {
	glob(path.join(__dirname, '../src/linter/**/*.md'), function(err, files) {
		if (err) {
			return;
		}
		var data = {};
		files.forEach(function(file) {
			var key = file.substr(__dirname.length + 1, file.length - 4 - __dirname.length).split(path.sep);
			key.shift();
			key.shift();
			key = key.join('.');
			data[key] = fs.readFileSync(file, 'utf-8');
		});
		data = JSON.stringify(data);
		var tmpDir = path.join(__dirname, '../tmp');
		if (!fs.existsSync(tmpDir)) {
			fs.mkdir(tmpDir);
		}
		fs.writeFileSync(path.join(tmpDir, 'docs.json'), data);
		callback();
	});
});
