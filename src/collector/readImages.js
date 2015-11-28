export default function readImages(document, data) {

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

			if (currentImage) {
				readImage(currentImage);
				delete currentImage.element;
			}

			if (Object.keys(images).reduce((done, key) => done && !images[key].element, true)) {
				finish();
				return;
			}

			if (!currentImage) {
				setTimeout(step, 16);
				return;
			}

			// Don’t force the main thread to go under 10 fps
			if (Date.now() - startTime > 1000 / 10) {
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
	image.size = {
		width: image.element.naturalWidth,
		height: image.element.naturalHeight,
	};
	image.type = image.url.split('#')[0].split('?')[0].split('.').pop().toLowerCase();
	if (image.type === 'jpg') {
		image.type = 'jpeg';
	}
	image.hash = getImageHash(image.element);
}

function getImageHash(image) {

	const size = 8;
	const depth = 16;
	const canvas = document.createElement('canvas');
	canvas.width = canvas.height = size;
	const ctx = canvas.getContext('2d');

	let data;
	try {
		ctx.drawImage(image, 0, 0, size, size);
		data = Array.from(ctx.getImageData(0, 0, size, size).data).reduce(
			(str, val) => str + Math.floor(val * (depth / 256)).toString(depth),
			''
		);
	}
	catch (e) {
		data = false;
	}
	return data;
}
