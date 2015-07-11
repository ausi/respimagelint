var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');
var phantomjsPath = require('phantomjs').path;
var lwip = require('lwip');

gulp.task('test', ['module:test'], function(callback) {

	createHtmlFile(function(htmlFile) {
		var args = [
			path.join(__dirname, 'test', 'phantomjs.js'),
			JSON.stringify({
				url: 'file://' + htmlFile,
			}),
		];
		childProcess.execFile(phantomjsPath, args, function(err, stdout, stderr) {
			if (err || stderr || !stdout) {
				throw new Error([err && err.message, stderr, stdout].join('\n'));
			}
			var data = JSON.parse(stdout);
			if (!data || !data.length) {
				throw new Error('Bad output from PhantomJS');
			}
			reviewTestResult(data);
			callback();
		});
	});

});

function reviewTestResult(data) {

	var passed = {};
	var failed = {};

	data.forEach(function(image) {

		var errors = [];
		if (image.data.img && image.data.img.errors) {
			errors = errors.concat(image.data.img.errors);
		}
		image.data.sources.forEach(function(source) {
			if (source.errors) {
				errors = errors.concat(source.errors);
			}
		});
		errors = errors.filter(function(error) {
			return error.key === image.test.key;
		});

		var key = image.test.key + '.' + image.test.type;

		if (image.test.type === 'good') {
			if (errors.length) {
				failed[key] = failed[key] || [];
				failed[key].push(image.data);
			}
			else {
				passed[key] = (passed[key] || 0) + 1;
			}
		}
		else {
			if (!errors.length) {
				failed[key] = failed[key] || [];
				failed[key].push(image.data);
			}
			else {
				passed[key] = (passed[key] || 0) + 1;
			}
		}

	});

	Object.keys(passed).forEach(function(key) {
		gutil.log('Test', gutil.colors.cyan(key), gutil.colors.green(passed[key], 'passed'));
	});

	Object.keys(failed).forEach(function(key) {
		gutil.log('Test', gutil.colors.cyan(key), gutil.colors.red(failed[key].length, 'failed'));
	});

	if (Object.keys(failed).length) {
		throw new gutil.PluginError('test', {
			message: 'Tests failed.\n' + JSON.stringify(failed, undefined, 2),
		});
	}

}

function createHtmlFile(callback) {

	var tmpDir = path.join(__dirname, '..', 'tmp', 'test');
	if (!fs.existsSync(tmpDir)) {
		fs.mkdir(tmpDir);
	}

	var docs = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'tmp', 'docs.json')));
	var html = '';

	html += Object.keys(docs).map(function(key) {
		var sections = docs[key].split('\n## ');
		sections.shift();
		return sections.map(function(section) {
			var testType;
			if (section.substr(0, 4) === 'Good') {
				testType = 'good';
			}
			else if (section.substr(0, 3) === 'Bad') {
				testType = 'bad';
			}
			else {
				return '';
			}
			var code = section.split('\n```html\n');
			code.shift();
			code = code.map(function(block) {
				return '<div data-test-key="' + key + '" data-test-type="' + testType + '">\n'
					+ block.split('\n```\n')[0]
					+ '\n</div>\n';
			});
			return code.join('');
		}).join('');
	}).join('');

	fs.writeFileSync(path.join(tmpDir, 'index.html'), html);

	createImageFiles(tmpDir, html, function() {
		callback(path.join(tmpDir, 'index.html'));
	});

}

function createImageFiles(tmpDir, html, callback) {

	var images = [];

	regExpMatchAll(/src(?:set)="([^"]+)"/g, html).forEach(function(match) {
		var urls = match[1].split(/[\s,]+/);
		urls.forEach(function(url) {
			if (url.match(/.+\.jpg/)) {
				images.push(url);
			}
		});
	});

	images = images.filter(function(url, index) {
		return images.indexOf(url) === index;
	});

	var imagesCreated = 0;

	images.forEach(function(url) {
		createImage(url, tmpDir, function() {
			imagesCreated++;
			if (imagesCreated === images.length) {
				callback();
			}
		});
	});

}

function createImage(url, tmpDir, callback) {

	var format = url.split('.')[1];
	var size = url.split('.')[0].split('x').map(function(val) {
		return parseInt(val);
	});

	lwip.create(size[0], size[1], function(err, image) {
		if (err) {
			throw err;
		}
		image.writeFile(path.join(tmpDir, url), format, function(err2) {
			if (err2) {
				throw err2;
			}
			callback();
		});
	});
}

function regExpMatchAll(regexp, str) {
	if (!regexp.global) {
		throw new Error('Regular expression is missing the global flag.');
	}
	var matches = [];
	var match;
	while ((match = regexp.exec(str)) !== null) {
		matches.push(match);
	}
	return matches;
}
