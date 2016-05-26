import error from '../../util/error';
import allSources from '../../util/allSources';
import computeLength from '../../util/computeLength';
import mediaToStringArray from '../../util/mediaToStringArray';
import stripViewportQueries from '../../util/stripViewportQueries';
import mediaMatchesViewport from '../../util/mediaMatchesViewport';

const threshold = 0.05;
const thresholdPx = 15;

export default function(image) {

	const errorItems = [];

	Object.keys(image.dimensions).forEach(viewWidth => {

		let imageWidth = image.dimensions[viewWidth];
		const sourceMatched = {};

		if (!imageWidth) {
			return;
		}

		allSources(image).forEach((item, itemIndex) => {

			const categories = mediaToStringArray(
				stripViewportQueries(item.media)
			).map(
				media => (item.type || 'image/*') + '|' + media
			);

			if (categories.reduce((result, category) => result || sourceMatched[category], false)) {
				return;
			}

			if (item.media && !mediaMatchesViewport(item.media, viewWidth)) {
				return;
			}
			categories.forEach(category => {
				sourceMatched[category] = true;
			});

			if (!item.sizes) {
				return;
			}

			let sizeMatched = false;
			item.sizes.forEach(({size, media}) => {

				if (sizeMatched) {
					return;
				}

				if (media && !mediaMatchesViewport(media, viewWidth)) {
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
						viewWidth,
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

		const firstItem = errorItems[itemIndex][
			[
				1280, 1440, 1000, 320, 480, 1920,
				Object.keys(errorItems[itemIndex])[0],
			].filter(
				viewWidth => errorItems[itemIndex][viewWidth]
			)[0]
		];

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
					? mediaToStringArray(media).join()
					: media
				) + ' ' : '') + size).join(', '),
			viewWidth: firstItem.viewWidth,
			imageWidth: firstItem.imageWidth,
			targetWidth: firstItem.targetWidth,
			difference: Math.round((1 - (firstItem.imageWidth / firstItem.targetWidth)) * -100) + '%',
			viewportRanges: viewportRanges.map(range => range[0] === range[1] ? range[0] : range.join('-')).join(', '),
		});

	});

}
