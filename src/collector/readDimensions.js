export default function readDimensions(iframe, data) {

	return new Promise((resolve) => {

		let width = 300;
		iframe.width = width;
		iframe.height = '100%';
		iframe.frameBorder = 0;
		iframe.contentWindow.document.documentElement.style.overflow = 'hidden';
		iframe.contentWindow.document.body.style.overflow = 'hidden';
		var referenceElement = iframe.contentWindow.document.createElement('img');
		if ('sizes' in referenceElement) {
			referenceElement.srcset = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7 1w';
			referenceElement.sizes = '100vw';
			let styles = {
				position: 'absolute',
				top: 0,
				left: 0,
				width: 'auto',
				height: 'auto',
			};
			for (let prop in styles) {
				referenceElement.style.setProperty(prop, styles[prop], 'important');
			}
			iframe.contentWindow.document.body.appendChild(referenceElement);
		}
		else {
			referenceElement = undefined;
		}

		function resizeStep(startTime = Date.now()) {

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
			width += 10;
			if (width > 4000) {
				resolve();
				return;
			}
			iframe.width = width;

			// Don’t force the main thread to go under 10 fps
			if (Date.now() - startTime > 1000 / 10) {
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
