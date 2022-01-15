import gulp from 'gulp';
import gutil from 'gulp-util';
import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';
import phantomjs from 'phantomjs-prebuilt';
//import lwip from '@randy.tarampi/lwip';
import crypto from 'crypto';

gulp.task('test', gulp.series('docs', 'module:test', callback => {

	createHtmlFile(htmlFile => {
		let args = [
			path.join(__dirname, 'test', 'phantomjs.js'),
			JSON.stringify({
				url: 'file://' + htmlFile,
			}),
		];
		childProcess.execFile(phantomjs.path, args, {maxBuffer: Infinity}, (err, stdout, stderr) => {
			if (err || stderr || !stdout) {
				throw new Error([err && err.message, stderr, stdout].join('\n'));
			}
			let data = JSON.parse(stdout);
			if (!data || !data.length) {
				throw new Error('Bad output from PhantomJS');
			}
			callback(reviewTestResult(data));
		});
	});

}));

function reviewTestResult(data) {

	let passed = {};
	let failed = {};

	data.forEach(image => {

		let errors = [];
		if (image.data.errors) {
			errors = errors.concat(image.data.errors);
		}
		if (image.data.img && image.data.img.errors) {
			errors = errors.concat(image.data.img.errors);
		}
		image.data.sources.forEach(source => {
			if (source.errors) {
				errors = errors.concat(source.errors);
			}
		});
		let filteredErrors = errors.filter(error => {
			return error.key === image.test.key;
		});

		let key = image.test.key + '.' + image.test.type;

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
			if (!filteredErrors.length) {
				failed[key] = failed[key] || [];
				failed[key].push(image.data);
			}
			else {
				passed[key] = (passed[key] || 0) + 1;
			}
		}

	});

	Object.keys(passed).forEach(key => {
		gutil.log('Test', gutil.colors.cyan(key), gutil.colors.green(passed[key], 'passed'));
	});

	Object.keys(failed).forEach(key => {
		gutil.log('Test', gutil.colors.cyan(key), gutil.colors.red(failed[key].length, 'failed'));
	});

	if (Object.keys(failed).length) {
		gutil.log(JSON.stringify(failed, undefined, 2));
		return new gutil.PluginError('test', {
			message: 'Tests failed.',
		});
	}

}

function createHtmlFile(callback) {

	let tmpDir = path.join(__dirname, '..', 'tmp', 'test');
	if (!fs.existsSync(tmpDir)) {
		fs.mkdir(tmpDir);
	}

	let docs = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'tmp', 'docs.json')));
	let html = '<!doctype html>';
	html += '<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">';

	html += Object.keys(docs).map(key => {
		let sections = docs[key].split('\n## ');
		sections.shift();
		return sections.map(section => {
			let testType;
			if (section.substr(0, 4) === 'Good') {
				testType = 'good';
			}
			else if (section.substr(0, 3) === 'Bad') {
				testType = 'bad';
			}
			else {
				return '';
			}
			let code = section.split('\n```html\n');
			code.shift();
			code = code.map(block =>
				'<div data-test-key="' + key + '" data-test-type="' + testType + '">\n'
				+ block.split('\n```\n')[0]
				+ '\n</div>\n'
			);
			return code.join('');
		}).join('');
	}).join('');

	fs.writeFileSync(path.join(tmpDir, 'index.html'), html);

	createImageFiles(tmpDir, html, () => {
		callback(path.join(tmpDir, 'index.html'));
	});

}

function createImageFiles(tmpDir, html, callback) {

	let images = [];

	regExpMatchAll(/src(?:set)?="([^"]+)"/g, html).forEach(match => {
		let urls = match[1].split(/[\s,]+/);
		urls.forEach(url => {
			if (url.match(/.+\.jpg$/)) {
				images.push(url);
			}
		});
	});

	images = images.filter((url, index) => images.indexOf(url) === index);

	let imagesCreated = 0;

	images.forEach(url => {
		createImage(url, tmpDir, () => {
			imagesCreated++;
			if (imagesCreated === images.length) {
				callback();
			}
		});
	});

}

function createImage(url, tmpDir, callback) {

	url = url.split('?')[0];

	let format = url.split('.')[1];
	let name = 'default';
	let size = url.split('.')[0];
	if (size.indexOf('-') !== -1) {
		name = size.split('-')[0];
		size = size.split('-')[1];
	}
	size = size.split('x').map(val => parseInt(val));

	let color = '777777';
	if (name !== 'default') {
		color = crypto.createHash('md5').update(name).digest('hex').substr(0, 6);
	}

	/*
	lwip.create(size[0], size[1], [
		parseInt(color.substr(0, 2), 16),
		parseInt(color.substr(2, 2), 16),
		parseInt(color.substr(4, 2), 16),
	], (err, image) => {
		if (err) {
			throw err;
		}
		image.writeFile(path.join(tmpDir, url), format, err2 => {
			if (err2) {
				throw err2;
			}
			callback();
		});
	});
	*/

	callback();
}

function regExpMatchAll(regexp, str) {
	if (!regexp.global) {
		throw new Error('Regular expression is missing the global flag.');
	}
	let matches = [];
	let match;
	while ((match = regexp.exec(str)) !== null) {
		matches.push(match);
	}
	return matches;
}
