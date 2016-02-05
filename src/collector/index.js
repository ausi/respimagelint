import 'babel-polyfill';
import find from './find';
import readData from './readData';
import readMarkup from './readMarkup';
import readDimensions from './readDimensions';
import readImages from './readImages';
import setStyles from '../util/setStyles';

export default function (document, includeDom = false) {

	let iframe, data, progressBar, overlay;

	function progress(done) {
		progressBar.value = done;
		setStyles(overlay, {opacity: done * 0.5 + 0.5});
		document.title = Math.round(done * 100) + '% collecting data...';
	}

	return Promise.resolve().then(() => {

		setStyles(document.body, {overflow: 'hidden'});
		setStyles(document.documentElement, {overflow: 'hidden'});

		iframe = document.createElement('iframe');
		iframe.src = document.location.href.split('#')[0] + (document.location.search ? '&' : '?') + document.location.hash;
		setStyles(iframe, {
			position: 'absolute',
			top: 0,
			left: 0,
			opacity: 0,
			'z-index': 2147483647,
			width: '100vw',
			'max-width': 'none',
			'min-width': 0,
			height: '100vh',
			'max-height': 'none',
			'min-height': 0,
			border: 0,
		});

		let promise = new Promise(resolve => {
			function checkLoaded() {
				if (
					iframe.contentWindow.jQuery
					&& iframe.contentWindow.jQuery.active !== 0
				) {
					setTimeout(checkLoaded, 10);
				}
				else {
					resolve();
				}
			}
			iframe.addEventListener('load', () => {
				setTimeout(checkLoaded);
			});
		});

		document.body.appendChild(iframe);

		overlay = document.createElement('div');
		document.body.appendChild(overlay);
		setStyles(overlay, {
			position: 'fixed',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			'background-color': 'rgba(255, 255, 255, 0)',
			opacity: 0.5,
			'z-index': 2147483647,
			transition: 'background-color 1s linear',
		});
		overlay.offsetWidth; // force layout
		setStyles(overlay, {'background-color': '#fff'});

		progressBar = document.createElement('progress');
		setStyles(progressBar, {
			position: 'fixed',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			width: '33%',
			'z-index': 2147483647,
		});
		document.body.appendChild(progressBar);

		progress(0.05);

		return promise;

	}).then(() => {

		progress(0.1);

		data = find(iframe.contentWindow.document)
			.map(readData)
			.map(readMarkup);

		return readDimensions(iframe, data, progressDone => {
			progress(0.1 + (0.8 * progressDone));
		});

	}).then(() => {

		progress(0.9);

		return readImages(iframe.contentWindow.document, data, progressDone => {
			progress(0.9 + (0.1 * progressDone));
		});

	}).then(() => {

		progress(1);

		if (!includeDom) {
			data.forEach(image => {
				delete image.dom;
			});
		}

		return data;

	});

}
