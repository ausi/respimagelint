import error from '../../util/error';

const threshold = 0.02;

export default function(item, images) {
	let sources = [];
	if (item.src) {
		sources.push(item.src);
	}
	item.srcset.forEach(({src}) => sources.push(src));
	const errorImages = {};
	sources.forEach(src => {
		if (!images[src].size.width || !images[src].size.height) {
			return;
		}
		sources.forEach(src2 => {
			if (
				src2 === src
				|| !images[src2].size.width
				|| !images[src2].size.height
				|| errorImages[src]
				|| errorImages[src2]
			) {
				return;
			}
			let srcW = Math.round(images[src2].size.width / images[src2].size.height * images[src].size.height);
			let src2W = Math.round(images[src].size.width / images[src].size.height * images[src2].size.height);
			if (
				(srcW < images[src].size.width * (1 - threshold) || srcW > images[src].size.width * (1 + threshold))
				&& (src2W < images[src2].size.width * (1 - threshold) || src2W > images[src2].size.width * (1 + threshold))
			) {
				error(__filename, item, {
					image1: src,
					ratio1: Math.round(100 / images[src].size.width * images[src].size.height) + '%',
					width1: images[src].size.width,
					height1: images[src].size.height,
					image2: src2,
					ratio2: Math.round(100 / images[src2].size.width * images[src2].size.height) + '%',
					width2: images[src2].size.width,
					height2: images[src2].size.height,
				});
				errorImages[src] = true;
				errorImages[src2] = true;
			}
		});
	});
}
