import marked from 'marked';
import getDocs from './util/getDocs';
import allSources from './util/allSources';

export default function (data) {

	let report = document.createElement('div');
	report.className = 'report';

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
		markup.textContent = buildMarkup(image.markup);
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

function buildErrors(data, images) {
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

	Object.keys(data).forEach(key => {
		if (images[data[key]]) {
			data[key + 'Url'] = images[data[key]].url;
			data[key + 'Type'] = images[data[key]].type;
			data[key + 'Width'] = images[data[key]].size.width;
			data[key + 'Height'] = images[data[key]].size.height;
		}
	});

	Object.keys(data).forEach(key => {
		message = message.split('{{' + key + '}}').join(data[key]);
	});

	element.innerHTML = marked(message);

	return element;

}
