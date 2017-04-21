if (!global._babelPolyfill) {
	require('babel-polyfill');
}

import find from './find';
import checkLazyImages from './checkLazyImages';
import readMediaQueries from './readMediaQueries';
import readData from './readData';
import readMarkup from './readMarkup';
import readDimensions from './readDimensions';
import readImages from './readImages';
import setStyles from '../util/setStyles';

export default function (document, includeDom = false) {

	let iframe, progressBar, progressMessage, overlay;
	let data = {};

	function progress(done, message) {
		progressBar.value = done;
		progressMessage.textContent = message;
		setStyles(overlay, {opacity: done * 0.5 + 0.5});
		document.title = Math.round(done * 100) + '% ' + message;
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

		let promise = new Promise((resolve, reject) => {
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
				try {
					let doc = iframe.contentWindow.document;
				}
				catch(e) {
					reject(new Error('Failed loading page into iframe.'));
					return;
				}
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

		progressMessage = document.createElement('div');
		setStyles(progressMessage, {
			position: 'fixed',
			top: '50%',
			left: '0',
			transform: 'translate(0, 50px)',
			width: '100%',
			'text-align': 'center',
			'font-size': '16px',
			color: 'black',
			'white-space': 'pre-line',
			'text-shadow': '0 0 2px white, 0 0 2px white, 0 0 2px white, 0 0 2px white',
			'z-index': 2147483647,
		});
		document.body.appendChild(progressMessage);

		progress(0.05, 'Loading page into frame...');

		return promise;

	}).then(() => {

		progress(0.075, 'Check for lazy loading images');

		return checkLazyImages(iframe);

	}).then(() => {

		progress(0.09, 'Read media queries');

		return readMediaQueries(iframe.contentWindow.document, data);

	}).then(() => {

		progress(0.1, 'Resizing');

		data.data = find(iframe.contentWindow.document)
			.map(readData)
			.map(readMarkup);

		return readDimensions(iframe, data.data, (progressDone, viewport) => {
			progress(0.1 + (0.8 * progressDone), 'Resizing to ' + viewport);
		});

	}).then(() => {

		progress(0.9, 'Reading image');

		return readImages(iframe.contentWindow.document, data.data, (progressDone, count, image) => {
			if (image) {
				progress(0.9 + (0.1 * progressDone), 'Reading image ' + Math.round(progressDone * count) + ' of ' + count + '\n' + image.url);
			}
		});

	}).then(() => {

		progress(1, 'Done');

		if (!includeDom) {
			data.data.forEach(image => {
				delete image.dom;
			});
		}

		return data;

	});

}
