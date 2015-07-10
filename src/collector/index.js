import 'babelify/polyfill';
import find from './find';
import readData from './readData';
import readMarkup from './readMarkup';
import readDimensions from './readDimensions';

export default function (document, callback) {

	let iframe, data;

	return Promise.resolve().then(() => {

		iframe = document.createElement('iframe');
		iframe.src = document.location.href + (document.location.search ? '&' : '?');
		iframe.style.position = 'absolute';
		iframe.style.top = 0;
		iframe.style.left = 0;

		let promise = new Promise(resolve => {
			iframe.addEventListener('load', resolve);
		});

		document.body.appendChild(iframe);

		return promise;

	}).then(() => {

		data = find(iframe.contentWindow.document)
			.map(readData)
			.map(readMarkup);

		return readDimensions(iframe, data);

	}).then(() => {

		data.forEach(image => {
			delete image.dom;
		});

		return JSON.parse(JSON.stringify(data));

	});

}
