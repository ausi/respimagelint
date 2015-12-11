import {setStyles} from './util';

const minWidth = 300;
const maxWidth = 4000;
const stepSize = 10;

export default function readDimensions(iframe, data, progress) {

	return new Promise((resolve) => {

		let width = minWidth;
		setStyles(iframe, {
			width: width + 'px',
			'max-width': 'none',
			'min-width': 0,
			height: '100vh',
			'max-height': 'none',
			'min-height': 0,
			border: 0,
		});
		setStyles(iframe.contentWindow.document.documentElement, {overflow: 'hidden'});
		setStyles(iframe.contentWindow.document.body, {overflow: 'hidden'});

		var referenceElement = iframe.contentWindow.document.createElement('img');
		if ('sizes' in referenceElement) {
			referenceElement.srcset = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7 1w';
			referenceElement.sizes = '100vw';
			setStyles(referenceElement, {
				position: 'absolute',
				top: 0,
				left: 0,
				width: 'auto',
				'max-width': 'none',
				'min-width': 0,
				height: 'auto',
				'max-height': 'none',
				'min-height': 0,
				border: 0,
				padding: 0,
			});
			iframe.contentWindow.document.body.appendChild(referenceElement);
		}
		else {
			referenceElement = undefined;
		}

		function resizeStep(startTime = Date.now()) {

			progress((width - minWidth) / (maxWidth - minWidth));

			// Chrome (43) needs some time to update image sizes based on the sizes attribute
			if (referenceElement && imageWidth(referenceElement) !== width) {
				setTimeout(resizeStep, 0);
				return;
			}

			let allLoaded = data.reduce(
				(loaded, image) => loaded && (!image.dom.img || image.dom.img.complete),
				true
			);
			if (!allLoaded) {
				setTimeout(resizeStep, 0);
				return;
			}

			addDimensions(data, width);
			width += stepSize;
			if (width > maxWidth) {
				progress(1);
				resolve();
				return;
			}
			setStyles(iframe, {width: width + 'px'});

			// Don’t force the main thread to go under 30 fps
			if (Date.now() - startTime > 1000 / 30) {
				setTimeout(resizeStep, 0);
				return;
			}

			resizeStep(startTime);
		}

		resizeStep();

	});

}

function addDimensions(data, width) {
	data.forEach(image => addDimension(image, width));
}

function addDimension(image, width) {
	image.dimensions = image.dimensions || {};
	if (!image.dom.img) {
		return;
	}
	image.dimensions[width] = imageWidth(image.dom.img);
}

function imageWidth(img) {
	return img.offsetWidth;
}
