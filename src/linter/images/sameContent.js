import error from '../../util/error';
import allSources from '../../util/allSources';
import hashDistance from '../../util/hashDistance';
import sameRatio from '../../util/sameRatio';

const threshold = 265;

export default function(image) {

	const images = image.images;

	const sourcesByType = {};
	allSources(image).forEach(item => {
		let sources = [];
		if (item.src) {
			sources.push(item.src);
		}
		item.srcset.forEach(({src}) => sources.push(src));
		let largestSource = sources.sort(
			(a, b) => images[b].size.width - images[a].size.width
		).reduce(
			(result, src) => result || (images[src].size.width && images[src].hash && src),
			false
		);
		if (!largestSource) {
			return;
		}
		let type = item.type || 'image/*';
		sourcesByType[type] = sourcesByType[type] || [];
		sourcesByType[type].push(largestSource);
	});

	const errorImages = {};

	Object.keys(sourcesByType).forEach(type => {
		sourcesByType[type].forEach((src, index) => {
			sourcesByType[type].forEach((src2, index2) => {
				if (
					index2 !== index
					&& src !== src2
					&& hashDistance(images[src].hash, images[src2].hash) < threshold
					&& sameRatio(images[src].size, images[src2].size)
					&& !errorImages[src]
					&& !errorImages[src2]
				) {
					error(__filename, image.data, {
						image1: src,
						hash1: images[src].hash,
						image2: src2,
						hash2: images[src2].hash,
						distance: Math.round(hashDistance(images[src].hash, images[src2].hash) / (16 * 256) * 100) + '%',
					});
					errorImages[src] = true;
					errorImages[src2] = true;
				}
			});
		});
	});

}
