import error from '../../util/error';
import hashDistance from '../../util/hashDistance';

const threshold = 1 / 25;

export default function(item, images) {
	let sources = [];
	if (item.src) {
		sources.push(item.src);
	}
	item.srcset.forEach(({src}) => sources.push(src));
	const errorImages = {};
	sources.forEach(src => {
		if (!images[src].hash) {
			return;
		}
		sources.forEach(src2 => {
			if (
				src2 !== src
				&& images[src2].hash
				&& images[src].hash !== images[src2].hash
				&& hashDistance(images[src].hash, images[src2].hash) > threshold
				&& !errorImages[src]
				&& !errorImages[src2]
			) {
				error(__filename, item, {
					image1: src,
					hash1: images[src].hash,
					image2: src2,
					hash2: images[src2].hash,
					distance: Math.round(hashDistance(images[src].hash, images[src2].hash) * 100) + '%',
				});
				errorImages[src] = true;
				errorImages[src2] = true;
			}
		});
	});
}
