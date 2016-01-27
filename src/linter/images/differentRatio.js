import error from '../../util/error';
import sameRatio from '../../util/sameRatio';

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
				src2 !== src
				&& images[src2].size.width
				&& images[src2].size.height
				&& !errorImages[src]
				&& !errorImages[src2]
				&& !sameRatio(images[src].size, images[src2].size)
			) {
				error(__filename, item, {
					image1: src,
					ratio1: Math.round(100 / images[src].size.width * images[src].size.height) + '%',
					image2: src2,
					ratio2: Math.round(100 / images[src2].size.width * images[src2].size.height) + '%',
				});
				errorImages[src] = true;
				errorImages[src2] = true;
			}
		});
	});
}
