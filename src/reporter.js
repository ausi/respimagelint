import {getDocs} from './linter/util';

export default function (data) {

	let report = document.createElement('div');

	let headline = document.createElement('h1');
	headline.textContent = 'Report for ' + data.href;
	report.appendChild(headline);

	data.data.map((image, index) => reportImage(image, index))
		.forEach(imageReport => {
			report.appendChild(imageReport)
		});

	return report;

}

function reportImage(image, index) {

	let report = document.createElement('div');

	let headline = document.createElement('h1');
	headline.textContent = 'Image #' + (index + 1);
	report.appendChild(headline);

	let markup = document.createElement('pre');
	markup.textContent = buildMarkup(image.markup);
	report.appendChild(markup);

	let errors = buildErrors(image.data);

	if (errors.length) {
		errors.forEach(error => report.appendChild(error));
	}
	else {
		let info = document.createElement('div');
		info.textContent = 'All checks passed.';
		report.appendChild(info);
	}

	return report;

}

function buildMarkup(markup, indentation = '', maxlength = 80) {

	let html = indentation + '<' + markup.tag;

	let attributes = (markup.attributes || [])
		.map(({name, value}) => {
			if (
				(name === 'srcset' || name === 'sizes')
				&& value.indexOf(',') !== -1
				&& name.length + value.length + indentation.length * 4 + 7 > maxlength
			) {
				value = '\n' + indentation + '\t\t' + value.trim().replace(/,\s*/g, ',\n' + indentation + '\t\t') + '\n' + indentation + '\t';
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

function buildErrors(data) {
	let errors = {};

	if (data.img && data.img.errors) {
		data.img.errors.forEach(error => {
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

	return Object.keys(errors).map(key => buildError(key, errors[key]));
}

function buildError(key, errors) {

	let element = document.createElement('div');

	let headline = document.createElement('h1');
	headline.textContent = errors[0].msg;
	element.appendChild(headline);

	let message = document.createElement('div');
	errors.forEach(({key, data}) => message.appendChild(buildErrorMessage(key, data)));
	element.appendChild(message);

	let text = document.createElement('div');
	text.textContent = getDocs(key, 'text');
	element.appendChild(text);

	return element;

}

function buildErrorMessage(key, data) {

	let element = document.createElement('div');

	let message = getDocs(key, 'Error template');

	Object.keys(data).forEach(key => {
		message = message.split('{{' + key + '}}').join(data[key]);
	});

	element.textContent = message;

	return element;

}
