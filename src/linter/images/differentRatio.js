import {error} from '../util';

const threshold = 0.02;

export default function(item, images) {
	let sources = [];
	if (item.src) {
		sources.push(item.src);
	}
	item.srcset.forEach(({src}) => sources.push(src));
	sources.forEach(src => {
		if (!images[src].size.width || !images[src].size.height) {
			return;
		}
		sources.forEach(src2 => {
			if (
				src2 === src
				|| !images[src2].size.width
				|| !images[src2].size.height
			) {
				return;
			}
			let srcW = Math.round(images[src2].size.width / images[src2].size.height * images[src].size.height);
			let src2W = Math.round(images[src].size.width / images[src].size.height * images[src2].size.height);
			if (
				(srcW < images[src].size.width * (1 - threshold) || srcW > images[src].size.width * (1 + threshold))
				&& (src2W < images[src2].size.width * (1 - threshold) || src2W > images[src2].size.width * (1 + threshold))
			) {
				error(__filename, item, [src, src2, images[src].size, images[src2].size]);
			}
		});
	});
}
