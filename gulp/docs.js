import gulp from 'gulp';
import fs from 'fs';
import path from 'path';
import glob from 'glob';
import { marked } from 'marked';
import prism from 'prismjs';

let markdownConfig = {
	gfm: true,
	tables: true,
	breaks: true,
	highlight: (code, lang) => {
		if (lang && prism.languages[lang]) {
			return prism.highlight(code, prism.languages[lang], lang);
		}
	},
};

gulp.task('docs', callback => {
	glob(path.join(__dirname, '../src/linter/**/*.md'), (err, files) => {

		if (err) {
			return;
		}

		let rootDir = path.parse(__dirname).dir;
		const docs = {};

		files.forEach(file => {
			let key = file.substr(rootDir.length + 1, file.length - 4 - rootDir.length).split(path.sep);
			key.shift();
			key.shift();
			key = key.join('.');
			docs[key] = fs.readFileSync(file, 'utf-8');
		});

		const data = JSON.stringify(docs);

		let tmpDir = path.join(rootDir, 'tmp');
		if (!fs.existsSync(tmpDir)) {
			fs.mkdirSync(tmpDir);
		}

		fs.writeFileSync(path.join(tmpDir, 'docs.json'), data);

		var docsHtml = '';
		var indexHtml = '';

		files.forEach(file => {
			let key = file.substr(rootDir.length + 1, file.length - 4 - rootDir.length).split(path.sep);
			key.shift();
			key.shift();
			key = key.join('.');
			var title = marked(getDocs(key, 'title'), markdownConfig).replace(/<\/?p>/gi, '').trim();
			indexHtml += '<li><a href="#' + key + '">' + title + '</a></li>';
			docsHtml += '<div class="docs-item">'
			docsHtml += '<h2 id="' + key + '">' + title + '</h2>\n';
			docsHtml += marked(getDocs(key, 'text'), markdownConfig);
			docsHtml += '<h3>Correct</h3>\n';
			docsHtml += marked(getDocs(key, 'Good'), markdownConfig);
			docsHtml += '<h3>Incorrect</h3>\n';
			docsHtml += marked(getDocs(key, 'Bad'), markdownConfig);
			docsHtml += '</div>'
		});

		var docsHtml = '<!doctype html>\n'
			+ '<meta charset="utf-8">\n'
			+ '<title>RespImageLint</title>\n'
			+ '<link rel="stylesheet" href="styles.css">\n'
			+ '<body>\n'
			+ '<div class="page">\n'
			+ '<h1>RespImageLint Linters</h1>\n'
			+ '<ul>\n'
			+ indexHtml
			+ '</ul>\n'
			+ docsHtml;

		fs.writeFileSync(path.join(__dirname, '..', 'dist', 'docs.html'), docsHtml);

		callback();

		function getDocs(key, section) {

			let doc = docs[key];

			if (!section) {
				return doc;
			}

			if (section === 'title') {
				return doc.split('\n')[0].substr(2);
			}

			if (section === 'text') {
				doc = doc.split(/^#[^\n]*/);
			}
			else {
				doc = doc.split('\n\n## ' + section + '\n\n');
			}

			if (doc.length < 2) {
				return '';
			}

			return doc[1].split('\n\n##')[0].trim();

		}

	});
});
