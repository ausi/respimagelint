import { marked } from 'marked';
import prism from 'prismjs';
import getDocs from './util/getDocs';
import allSources from './util/allSources';

export default function (data) {

	let report = document.createElement('div');
	report.className = 'report';

	let headline = document.createElement('h1');
	headline.textContent = 'Responsive Images Report for ';
	report.appendChild(headline);

	let link = document.createElement('a');
	link.href = link.textContent = data.href;
	headline.appendChild(link);

	let viewSettings = document.createElement('input');
	viewSettings.type = 'checkbox';
	viewSettings.id = 'view-settings';
	report.appendChild(viewSettings);

	let viewSettingsLabel = document.createElement('label');
	viewSettingsLabel.textContent = 'Only show failed checks';
	viewSettingsLabel.setAttribute('for', 'view-settings');
	report.appendChild(viewSettingsLabel);

	data.data.map((image, index) => reportImage(image, index)).forEach(imageReport => {
		report.appendChild(imageReport)
	});

	let reportInfo = document.createElement('p');
	reportInfo.textContent = report.querySelectorAll('.report-item.-passed').length + ' out of ' + report.querySelectorAll('.report-item').length + ' images passed all checks.';
	report.insertBefore(reportInfo, viewSettings);


	if (!data.data.length) {
		let text = document.createElement('p');
		text.textContent = 'No images were found on this page.';
		report.appendChild(text);
	}

	return report;

}

function reportImage(image, index) {

	let report = document.createElement('div');
	report.className = 'report-item';

	let header = document.createElement('header');
	header.className = 'report-item-header';

	let img = document.createElement('img');
	img.src = image.data.img
		&& image.images[image.data.img.src]
		&& image.images[image.data.img.src].url
		|| allSources(image).reverse().reduce(
		(result, source) => result || source.srcset.reduce(
			(url, srcset) => url || (
				image.images[srcset.src]
				&& image.images[srcset.src].url
			),
			false
		),
		false
	);
	header.appendChild(img);

	let headline = document.createElement('h2');
	headline.textContent = 'Image #' + (index + 1);
	header.appendChild(headline);

	report.appendChild(header);

	let errors = buildErrors(image.data, image.images);

	if (errors.length) {

		errors.forEach(error => report.appendChild(error));

		let markup = document.createElement('pre');
		let html = '<code>' + prism.highlight(
			buildMarkup(image.markup),
			prism.languages.html,
			'html'
		) + '</code>';

		Object.keys(image.images).sort(
			(a, b) => b.length - a.length
		).forEach(src => {
			html = html.replace(new RegExp(
				'([>,\\s])('
				+ src.replace(/&/g, '&amp;').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&')
				+ ')([<,\\s])'
			, 'g'), '$1<a class="token regex" href="' + image.images[src].url + '">$2</a>$3');
		});

		markup.innerHTML = html;

		report.appendChild(markup);

	}
	else {
		let info = document.createElement('p');
		info.textContent = 'All checks passed.';
		report.appendChild(info);
		report.className += ' -passed';
	}

	return report;

}

function buildMarkup(markup, indentation = '', maxlength = 95) {

	let html = indentation + '<' + markup.tag;

	let attributes = (markup.attributes || [])
		.map(({name, value}) => {
			if (
				(name === 'srcset' || name === 'sizes')
				&& value.indexOf(',') !== -1
				&& name.length + value.length + indentation.length * 4 + 7 > maxlength
			) {
				value = '\n' + indentation + '\t\t' + value.trim().replace(/,\s+/g, ',\n' + indentation + '\t\t') + '\n' + indentation + '\t';
			}
			return name + '="' + value + '"';
		});
	if (attributes.length) {
		if (attributes.join(' ').length + markup.tag.length + indentation.length * 4 + 3 > maxlength) {
			html += '\n' + indentation + '\t' + attributes.join('\n' + indentation + '\t') + '\n' + indentation;
		}
		else {
			html += ' ' + attributes.join(' ');
		}
	}

	html += '>';

	let contents = (markup.children || [])
		.map(child => buildMarkup(child, indentation + '\t', maxlength))
		.join('\n');

	if (contents) {
		html += '\n' + contents + '\n' + indentation;
	}

	if (markup.tag !== 'img' && markup.tag !== 'source') {
		html += '</' + markup.tag + '>';
	}

	return html;

}

function buildErrors(data, images) {
	let errors = {};

	if (data.errors) {
		data.errors.forEach(error => {
			errors[error.key] = errors[error.key] || [];
			errors[error.key].push(error);
		});
	}

	data.sources.forEach(source => {
		if (source.errors) {
			source.errors.forEach(error => {
				errors[error.key] = errors[error.key] || [];
				errors[error.key].push(error);
			});
		}
	});

	if (data.img && data.img.errors) {
		data.img.errors.forEach(error => {
			errors[error.key] = errors[error.key] || [];
			errors[error.key].push(error);
		});
	}

	return Object.keys(errors).map(key => buildError(key, errors[key], images));
}

function buildError(key, errors, images) {

	let element = document.createElement('div');

	let headline = document.createElement('h3');
	headline.innerHTML = marked(errors[0].msg).replace(/<\/?p>/gi, '');
	element.appendChild(headline);

	let message = document.createElement('div');
	errors.forEach(({key, data}) => message.appendChild(buildErrorMessage(key, data, images)));
	element.appendChild(message);

	let text = document.createElement('div');
	text.innerHTML = marked(getDocs(key, 'text'));
	element.appendChild(text);

	return element;

}

function buildErrorMessage(key, data, images) {

	let element = document.createElement('div');

	let message = getDocs(key, 'Error template');

	const urls = [];

	Object.keys(data).forEach(key => {
		if (images[data[key]]) {
			data[key + 'Url'] = images[data[key]].url;
			data[key + 'Type'] = images[data[key]].type;
			data[key + 'Size'] = images[data[key]].size.width + 'x' + images[data[key]].size.height;
			data[key + 'Width'] = images[data[key]].size.width;
			data[key + 'Height'] = images[data[key]].size.height;
			urls.push(data[key]);
		}
	});

	const shortUrls = shortenUrls(urls);

	urls.forEach((url, i) => {
		Object.keys(data).forEach(key => {
			if (images[data[key]] && data[key] === url && key.substr(-3) !== 'Url') {
				data[key] = shortUrls[i];
			}
		});
	});

	Object.keys(data).forEach(key => {
		message = message.split('{{' + key + '}}').join(
			typeof data[key] === 'number'
				? data[key]
				: (data[key] || '\u200B')
		);
	});

	element.innerHTML = marked(message);

	return element;

}

function shortenUrl(url, maxLength) {

	if (!url || url.length <= maxLength) {
		return url;
	}

	url = url.replace(/^https?:\/\/[^/]+\//gi, '');
	let query = '';

	let prefix = '';
	let suffix = '';

	if (url.indexOf('?') !== -1) {
		query = url.substr(url.indexOf('?'));
		url = url.substr(0, url.indexOf('?'));
	}

	while (url.length + query.length >= maxLength && url.indexOf('/') !== -1) {
		url = url.substr(url.indexOf('/') + 1);
		prefix = '…/';
	}

	while (url.length + query.length >= maxLength && query.lastIndexOf('&') !== -1) {
		query = query.substr(0, query.lastIndexOf('&'));
		suffix = '…';
	}

	return prefix + url + query + suffix;
}

function shortenUrls(urls) {

	const maxLength = 32;

	if (!urls) {
		return urls;
	}

	if (urls.length < 2) {
		return urls.map(url => shortenUrl(url, maxLength));
	}

	let longestLength = urls.map(url => url.length).sort((a, b) => b - a)[0];
	if (longestLength <= maxLength) {
		return urls;
	}

	let prefix = '';
	let done = false;
	while (!done) {
		prefix += urls[0][prefix.length];
		for (let i = 0; i < urls.length; i++) {
			if (urls[i].substr(0, prefix.length) !== prefix) {
				prefix = prefix.substr(0, prefix.length - 1);
				done = true;
				break;
			}
		}
	}
	prefix = prefix.replace(/[^/]*$/gi, '');

	urls = urls.map(url => url.substr(prefix.length));

	longestLength -= prefix.length;
	if (longestLength <= maxLength) {
		return urls;
	}

	let suffix = '';
	done = false;
	while (!done) {
		suffix = urls[0].substr(urls[0].length - suffix.length - 1, 1) + suffix;
		for (let i = 0; i < urls.length; i++) {
			if (urls[i].substr(urls[i].length - suffix.length) !== suffix) {
				suffix = suffix.substr(1);
				done = true;
				break;
			}
		}
	}
	suffix = suffix.replace(/^[^?&]*/gi, '');

	urls = urls.map(url => url.substr(0, url.length - suffix.length));

	longestLength -= suffix.length;
	if (longestLength <= maxLength) {
		return urls;
	}

	const queryCounts = {};
	urls.forEach(url => {
		if (url.indexOf('?') === -1) {
			return;
		}
		url.substr(url.indexOf('?') + 1).split('&')
			.filter((val, index, arr) => arr.indexOf(val) === index)
			.forEach(queryPart => {
				queryCounts[queryPart] = (queryCounts[queryPart] || 0) + 1;
			});
	});

	Object.keys(queryCounts).forEach(queryPart => {
		if (queryCounts[queryPart] !== urls.length) {
			return;
		}
		urls = urls.map(url => url.substr(0, url.indexOf('?') + 1)
			+ url.substr(url.indexOf('?') + 1).split('&')
				.map(val => val === queryPart ? '…' : val)
				.join('&')
		);
	});

	urls = urls.map(url =>
		url.replace(/[?&]…(?:&…)*(?:&|$)/gi, '…')
	);

	return urls.map(url =>
		(prefix.length ? '…/' : '')
		+ url
		+ (suffix.length ? suffix[0] + '…' : '')
	);
}
