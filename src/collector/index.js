import 'babel-polyfill';
import find from './find';
import readData from './readData';
import readMarkup from './readMarkup';
import readDimensions from './readDimensions';
import readImages from './readImages';

export default function (document, includeDom = false) {

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

		return readImages(iframe.contentWindow.document, data);

	}).then(() => {

		if (!includeDom) {
			data.forEach(image => {
				delete image.dom;
			});
		}

		return data;

	});

}
