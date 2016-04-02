export default function readImages(document, data, progress) {

	return new Promise(resolve => {

		let urls = [];

		data.forEach(({data: image}) => {
			if (image.img && image.img.src) {
				urls.push(image.img.src);
			}
			if (image.img && image.img.srcset) {
				image.img.srcset.forEach(({src}) => {
					urls.push(src);
				});
			}
			image.sources.forEach(({srcset}) => {
				srcset.forEach(({src}) => {
					urls.push(src);
				});
			});
		});

		urls = urls.filter((url, index) => urls.indexOf(url) === index);

		let images = {};

		urls.forEach(url => {
			let image = {
				url: resolveUrl(document, url),
			};
			let element = new Image();
			element.src = image.url;
			image.element = element;
			images[url] = image;
		});

		function step(startTime = Date.now()) {

			let currentImage;

			Object.keys(images).forEach(key => {
				if (images[key].element && images[key].element.complete) {
					currentImage = images[key];
				}
			});

			progress(Object.keys(images).reduce(
				(count, key) => count + (images[key].element ? 0 : 1),
				0
			) / (Object.keys(images).length || 1), Object.keys(images).length, currentImage);

			if (currentImage) {
				readImage(currentImage);
				if (currentImage.hash === null && currentImage.element.src.split('/')[2] !== 'crossorigin.me') {
					currentImage.element = new Image();
					currentImage.element.crossOrigin = 'anonymous';
					currentImage.element.src = 'https://crossorigin.me/' + currentImage.url;
				}
				else {
					delete currentImage.element;
				}
			}

			if (Object.keys(images).reduce((done, key) => done && !images[key].element, true)) {
				progress(1, Object.keys(images).length);
				finish();
				return;
			}

			if (!currentImage) {
				setTimeout(step, 16);
				return;
			}

			// Don’t force the main thread to go under 30 fps
			if (Date.now() - startTime > 1000 / 30) {
				setTimeout(step, 0);
				return;
			}

			step(startTime);

		}

		step();

		function finish() {

			data.forEach(image => {
				image.images = {};
				if (image.data.img && image.data.img.src) {
					image.images[image.data.img.src] = images[image.data.img.src];
				}
				if (image.data.img && image.data.img.srcset) {
					image.data.img.srcset.forEach(({src}) => {
						image.images[src] = images[src];
					});
				}
				image.data.sources.forEach(({srcset}) => {
					srcset.forEach(({src}) => {
						image.images[src] = images[src];
					});
				});
			});

			resolve();

		}

	});

}

function resolveUrl(document, url) {
	let link = document.createElement('a');
	link.href = url;
	return link.href + '';
}

function readImage(image) {
	image.size = image.size || {
		width: image.element.naturalWidth,
		height: image.element.naturalHeight,
	};
	image.type = image.type || image.url.split('#')[0].split('?')[0].split('.').pop().toLowerCase();
	if (image.type === 'jpg') {
		image.type = 'jpeg';
	}
	image.hash = image.hash || getImageHash(image.element);
}

function getImageHash(image) {

	const size = 8;
	const depth = 16;

	let data;
	try {
		let empty = true;
		data = Array.from(
			stepDownResize(image, size).getImageData(0, 0, size, size).data
		).reduce(
			(str, val, i, arr) => {
				if (val) {
					empty = false;
				}
				if ((i + 1) % 4) {
					var opacity = arr[i + (4 - ((i + 1) % 4))] / 255;
					val *= opacity;
					if (i % 4 === i % 8) {
						val += 255 * (1 - opacity);
					}
					str += Math.round(val * ((depth - 1) / 255)).toString(depth);
				}
				return str;
			},
			''
		);
		if (empty) {
			data = undefined;
		}
	}
	catch (e) {
		// Check for security error because of tainted canvas
		if (e.code === 18) {
			data = null;
		}
	}

	return data;
}

function stepDownResize(image, targetSize) {

	const imageSize = Math.max(image.naturalWidth || 0, image.naturalHeight || 0, targetSize);
	let size = targetSize;
	while (size * 2 < imageSize) {
		size *= 2;
	}

	const ctx = createCanvasCtx(size);
	const ctxTmp = createCanvasCtx(size);
	ctx.drawImage(image, 0, 0, size, size);

	// Throw tainted canvas security error before resizing
	ctx.getImageData(0, 0, 1, 1);

	while (size > targetSize) {
		ctxTmp.clearRect(0, 0, size, size);
		ctxTmp.drawImage(
			ctx.canvas,
			0, 0, size, size,
			0, 0, size, size
		);
		ctx.clearRect(0, 0, size / 2, size / 2);
		ctx.drawImage(
			ctxTmp.canvas,
			0, 0, size, size,
			0, 0, size / 2, size / 2
		);
		size /= 2;
	}

	return ctx;

}

function createCanvasCtx(size) {
	const canvas = document.createElement('canvas');
	canvas.width = canvas.height = size;
	return canvas.getContext('2d');
}
