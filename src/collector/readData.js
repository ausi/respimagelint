import parseMedia from '../util/parseMedia';

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
	const srcset = [];
	attribute.replace(
		/,*(\S*?[^\s,])(?:\s,|,+\s|,?$|\s([^,]+)(?:,|$))/g,
		(match, src, descriptor) => {
			srcset.push({
				src,
				descriptor: descriptor && descriptor.trim(),
			});
		}
	);
	return srcset;
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
