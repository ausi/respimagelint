export default function readData(image) {

	let img = image.dom.img;

	image.data = {
		img: img && {
			src: img.getAttribute('src'),
			srcset: parseSrcset(img.getAttribute('srcset')),
			sizes: parseSizes(img.getAttribute('sizes')),
		},
		sources: image.dom.sources.map(source => {
			return {
				srcset: parseSrcset(source.getAttribute('srcset')),
				sizes: parseSizes(source.getAttribute('sizes')),
				media: parseMedia(source.getAttribute('media')),
				type: source.getAttribute('type') || undefined,
			};
		}),
	};

	return image;

}
function parseSrcset(attribute) {
	if (!attribute) {
		return [];
	}
	return attribute.split(',').map(source => {
		let [src, descriptor] = source.trim().split(/\s+/);
		return {src, descriptor};
	});
}

function parseSizes(attribute) {
	if (!attribute) {
		return [];
	}
	return attribute.split(',').map(size => {
		size = size.trim();
		let media;
		size = size.replace(/^\(.+?\)\s+/, match => {
			media = parseMedia(match.trim());
			return '';
		});
		return {size, media};
	});
}

function parseMedia(attribute) {
	if (!attribute) {
		return undefined;
	}
	let matches = attribute
		.trim()
		.toLowerCase()
		.match(/^\(\s*((?:max|min)-width):\s*([0-9a-z]+)\s*\)$/i);
	if (!matches) {
		return attribute.trim();
	}
	return {
		[matches[1]]: matches[2],
	};
}
