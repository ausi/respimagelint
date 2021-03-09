import jpegQuality from '../util/jpegQuality';

export default function readImages(document, data, progress) {

	return Promise.resolve().then(() => {

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
				element: new Image(),
			};
			images[url] = image;
		});

		return Promise.all(Object.keys(images).map(key => {

			const image = images[key];

			return loadImageAsBlob(image.url)

				.then(blob => {
					const loadedPromise = new Promise(resolve => {
						image.element.onload = image.element.onerror = () => resolve();
					});
					image.blob = blob;
					image.element.src = URL.createObjectURL(blob);
					return loadedPromise;
				})

				// Fall back to classc image loading
				.catch(() => {
					const loadedPromise = new Promise(resolve => {
						image.element.onload = image.element.onerror = () => resolve();
					});
					image.element.src = image.url;
					return loadedPromise;
				})

				.then(() => {
					readImage(image);
					return readQuality(image);
				})

				// Fail silently
				.catch(() => {})

				.then(() => {
					progress(
						Object.keys(images).reduce(
							(count, key) => count + (images[key].element ? 0 : 1),
							0
						) / (Object.keys(images).length || 1),
						Object.keys(images).length,
						image
					);
				})

				// Clean data
				.then(() => {
					delete image.blob;
					delete image.element;
				})

			;

		})).then(() => images);

	})
	.then(images => {

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
	if (image.blob && image.blob.type) {
		image.type = image.blob.type;
	}
	else {
		let extension = image.url
			.split('#')[0]
			.split('?')[0]
			.split('/').pop()
			.split('.').pop()
			.toLowerCase();
		if (extension === 'jpg') {
			extension = 'jpeg';
		}
		if (extension === 'svg') {
			extension = 'svg+xml';
		}
		image.type = extension ? 'image/' + extension : undefined;
	}
	image.hash = getImageHash(image.element);
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
		data = undefined;
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

function loadImageAsBlob(url) {
	return Promise.resolve()
	.then(() => fetch(url, {
		headers: {
			'Accept': 'image/*,*/*;q=0.8',
			'X-Requested-With': 'XMLHttpRequest',
		},
	}))
	.then(response => {
		if (response.status >= 200 && response.status < 300) {
			return response;
		}
		else {
			let error = new Error(response.statusText);
			error.response = response;
			throw error;
		}
	})
	.then(response => response.blob());
}

function readQuality(image) {
	return Promise.resolve()
	.then(() => {
		return getQualityFromBlob(image.blob);
	})
	.catch((err) => {
		return undefined;
	})
	.then(quality => {
		image.quality = quality;
	});
}

function getQualityFromBlob(blob) {
	if (!blob) {
		throw new Error('Missing blob');
	}
	if (blob.type === 'image/jpeg') {
		return getJpegQualityFromBlob(blob);
	}
	if (blob.type === 'image/png' || blob.type === 'image/gif') {
		return 100;
	}
	throw new Error('Unable to read quality from image type ' + blob.type);
}

function getJpegQualityFromBlob(blob) {
	return readBlobAsArrayBuffer(blob).then(buffer => {
		return jpegQuality(buffer);
	});
}

function readBlobAsArrayBuffer(blob) {
	var reader = new FileReader();
	reader.readAsArrayBuffer(blob);
	return new Promise(function(resolve, reject) {
		reader.onload = function() {
			resolve(reader.result);
		};
		reader.onerror = function() {
			reject(reader.error);
		};
	});
}
