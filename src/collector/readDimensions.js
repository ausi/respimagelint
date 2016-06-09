import setStyles from '../util/setStyles';

const minWidth = 300;
const maxWidth = 3000;
const stepSize = 10;

export default function readDimensions(iframe, data, progress) {

	return new Promise((resolve) => {

		const iframeDoc = iframe.contentWindow.document;

		let width = minWidth;
		setStyles(iframe, {
			width: width + 'px',
		});
		setStyles(iframeDoc.documentElement, {overflow: 'hidden'});
		setStyles(iframeDoc.body, {overflow: 'hidden'});

		let referenceImg = iframeDoc.createElement('img');
		if ('sizes' in referenceImg) {
			referenceImg.srcset = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7 1w';
			referenceImg.sizes = '100vw';
			setStyles(referenceImg, {
				position: 'absolute',
				top: 0,
				left: 0,
				display: 'block',
				width: 'auto',
				'max-width': 'none',
				'min-width': 0,
				height: 'auto',
				'max-height': 'none',
				'min-height': 0,
				border: 0,
				padding: 0,
			});
			iframeDoc.body.appendChild(referenceImg);
		}
		else {
			referenceImg = undefined;
		}

		let referenceSource = iframeDoc.createElement('source');
		let referencePicture = iframeDoc.createElement('picture');
		if ('sizes' in referenceSource) {
			referenceSource.srcset = referenceImg.srcset;
			referenceSource.sizes = '50vw';
			const media = [];
			for (let width = minWidth; width <= maxWidth; width += stepSize * 2) {
				media.push(width);
			}
			referenceSource.media = media.map(width => '(width:' + width + 'px)').join(',');
			referencePicture.appendChild(referenceSource);
			referencePicture.appendChild(referenceImg);
			iframeDoc.body.appendChild(referencePicture);
		}
		else {
			referenceSource = undefined;
			referencePicture = undefined;
		}

		const initTime = Date.now();
		let skipSizeCheck = false;

		function resizeStep(startTime = Date.now()) {

			progress((width - minWidth) / (maxWidth - minWidth), width);

			let referenceWidth = width;

			// Firefox (46) needs some time to update images based on media queries
			if (referenceSource && (width - minWidth) % (stepSize * 2) === 0) {
				referenceWidth /= 2;
			}

			// Chrome (43) needs some time to update image sizes based on the sizes attribute
			if (referenceImg && imageWidth(referenceImg) !== referenceWidth && !skipSizeCheck) {

				// Fix bug in Safari which never resizes the reference image
				if (width === minWidth && Date.now() - initTime > 5000) {
					skipSizeCheck = true;
				}

				// Trigger a reflow for Firefox (46)
				setStyles(iframeDoc.body, {display: 'none'});
				iframeDoc.body.offsetHeight;
				setStyles(iframeDoc.body, {display: ''});

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
				progress(1, maxWidth);
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
	const style = getComputedStyle(img);
	return img.clientWidth
		- parseFloat(style.paddingLeft)
		- parseFloat(style.paddingRight);
}
