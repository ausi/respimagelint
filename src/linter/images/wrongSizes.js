import error from '../../util/error';
import allSources from '../../util/allSources';

const threshold = 0.02;
const thresholdPx = 10;

export default function(image) {

	const errorItems = [];

	Object.keys(image.dimensions).forEach(viewWidth => {

		let imageWidth = image.dimensions[viewWidth];
		const sourceMatched = [];
		allSources(image).forEach((item, itemIndex) => {

			if (sourceMatched[item.type || 'image/*']) {
				return;
			}

			if (item.media && ((
				item.media['max-width']
				&& viewWidth > computeLength(item.media['max-width'])
			) || (
				item.media['min-width']
				&& viewWidth < computeLength(item.media['min-width'])
			))) {
				return;
			}
			sourceMatched[item.type || 'image/*'] = true;

			if (!item.sizes) {
				return;
			}

			let sizeMatched = false;
			item.sizes.forEach(({size, media}) => {

				if (sizeMatched) {
					return;
				}

				if (media && ((
					media['max-width']
					&& viewWidth > computeLength(media['max-width'])
				) || (
					media['min-width']
					&& viewWidth < computeLength(media['min-width'])
				))) {
					return;
				}
				sizeMatched = true;

				let targetWidth = computeLength(size, viewWidth);
				if (
					imageWidth < targetWidth - (targetWidth * threshold) - thresholdPx
					|| imageWidth > targetWidth + (targetWidth * threshold) + thresholdPx
				) {
					errorItems[itemIndex] = errorItems[itemIndex] || {};
					errorItems[itemIndex][viewWidth] = {
						targetWidth,
						imageWidth,
						size,
					};
				}

			});

		});

	});

	allSources(image).forEach((item, itemIndex) => {

		if (!errorItems[itemIndex]) {
			return;
		}

		const firstItem = errorItems[itemIndex][Object.keys(errorItems[itemIndex])[0]];

		const viewportRanges = [];
		let lastViewWidth = 0;

		Object.keys(errorItems[itemIndex]).forEach(viewWidth => {
			if (lastViewWidth < viewWidth - 10) {
				viewportRanges.push([viewWidth, viewWidth]);
			}
			viewportRanges[viewportRanges.length - 1][1] = viewWidth;
			lastViewWidth = viewWidth;
		});

		error(__filename, item, {
			sizes: item.sizes.map(({size, media}) =>
				(media ? (typeof media === 'object'
					? '(' + Object.keys(media)[0] + ': ' + media[Object.keys(media)[0]] + ')'
					: media
				) + ' ' : '') + size).join(', '),
			viewWidth: +Object.keys(errorItems[itemIndex])[0],
			imageWidth: firstItem.imageWidth,
			targetWidth: firstItem.targetWidth,
			difference: Math.round((1 - (firstItem.imageWidth / firstItem.targetWidth)) * -100) + '%',
			viewportRanges: viewportRanges.map(range => range.join('-')).join(', '),
		});

	});

}

function computeLength(length, viewWidth) {

	if (!length) {
		return 0;
	}

	length = length.replace(
		/\d*\.?\d+v(?:w|h|min|max)/gi,
		match => parseFloat(match) * viewWidth / 100 + 'px'
	);

	if (length.match(/^\d*\.?\d+px$/)) {
		return Math.round(parseFloat(length));
	}

	if (length.match(/^\d*\.?\d+em$/)) {
		return Math.round(parseFloat(length) * 16);
	}

	const wrap = document.createElement('div');
	wrap.style.width = 0;
	wrap.style.fontSize = '16px';

	const element = document.createElement('div');
	element.style.width = length;

	wrap.appendChild(element);
	document.body.appendChild(wrap);

	const result = element.offsetWidth;

	document.body.removeChild(wrap);

	return result;

}
