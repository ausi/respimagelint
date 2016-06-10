import error from '../../util/error';
import allSources from '../../util/allSources';
import hashDistance from '../../util/hashDistance';
import sameRatio from '../../util/sameRatio';

const threshold = 1 / 16;

export default function(image) {

	const images = image.images;

	let ignoreFollowing = false;
	const sourcesByType = {};
	allSources(image).forEach(item => {

		if (ignoreFollowing) {
			return;
		}

		let sources = [];
		if (item.src && !item.srcset.length) {
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
		sourcesByType[type].push({
			src: largestSource,
			highDpi: isDpiQuery(item.media, true),
			lowDpi: isDpiQuery(item.media, false),
		});

		if (type === 'image/*' && !item.media) {
			ignoreFollowing = true;
		}

	});

	const errorImages = {};

	Object.keys(sourcesByType).forEach(type => {
		sourcesByType[type].forEach(({src, highDpi, lowDpi}, index) => {
			sourcesByType[type].forEach(({src: src2, highDpi: highDpi2, lowDpi: lowDpi2}, index2) => {
				if (
					index2 !== index
					&& src !== src2
					&& hashDistance(images[src].hash, images[src2].hash) < threshold
					&& sameRatio(images[src].size, images[src2].size)
					&& !errorImages[src]
					&& !errorImages[src2]
					&& !(images[src].quality && images[src2].quality && (
						(highDpi && !highDpi2 && images[src].quality < images[src2].quality - 10)
						|| (!highDpi && highDpi2 && images[src2].quality < images[src].quality - 10)
						|| (lowDpi && !lowDpi2 && images[src2].quality < images[src].quality - 10)
						|| (!lowDpi && lowDpi2 && images[src].quality < images[src2].quality - 10)
					))
				) {
					error(__filename, image.data, {
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
	});

}

function isDpiQuery(media, highDpi) {
	if (!media || typeof media === 'string') {
		return false;
	}
	return !!media.filter(({type, expressions, inverse}) => {
		let matches = false;
		expressions.filter(
			({feature}) => feature === 'resolution'
		).forEach(({modifier, value}) => {
			if (computeDppx(value) > 1.1 && (
				(highDpi && modifier === 'min' && !inverse)
				|| (highDpi && modifier === 'max' && inverse)
				|| (!highDpi && modifier === 'max' && !inverse)
				|| (!highDpi && modifier === 'min' && inverse)
			)) {
				matches = true;
			}
		});
		return matches;
	}).length;
}

function computeDppx(value) {

	if (!value) {
		return undefined;
	}

	if (value.match(/^\d*\.?\d+dpi$/)) {
		return parseFloat(value) / 96;
	}

	if (value.match(/^\d*\.?\d+dpcm$/)) {
		return parseFloat(value) / 96 * 2.54;
	}

	if (value.match(/^\d*\.?\d+dppx$/)) {
		return parseFloat(value);
	}

	return undefined;
}
