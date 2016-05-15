import error from '../../util/error';
import allSources from '../../util/allSources';
import computeLength from '../../util/computeLength';

const threshold = 0.5;

export default function(image) {

	const errorItems = [];

	Object.keys(image.dimensions).forEach(viewWidth => {

		let imageWidth = image.dimensions[viewWidth];
		const sourceMatched = [];
		allSources(image).forEach((item, itemIndex) => {

			if (sourceMatched[item.type || 'image/*']) {
				return;
			}

			if (item.type === 'svg' || !imageWidth) {
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

			let srcs = item.srcset.map(({src}) => src);

			if (item.src && !item.srcset.filter(({descriptor = '1x'}) =>
				descriptor.substr(-1) !== 'x' || descriptor === '1x'
			).length) {
				srcs.push(item.src);
			}

			let nearbyWidth = srcs
				.map(src => image.images[src].size.width)
				.filter(Boolean)
				.sort((a, b) => {
					[a, b] = [a, b].map(width => 1 - (
						imageWidth < width
							? imageWidth / width
							: width / imageWidth
					));
					return a - b;
				})[0];

			if (!nearbyWidth) {
				return;
			}

			const distance = 1 - (
				imageWidth < nearbyWidth
					? imageWidth / nearbyWidth
					: nearbyWidth / imageWidth
			);

			if (distance > threshold) {
				errorItems[itemIndex] = errorItems[itemIndex] || {};
				errorItems[itemIndex][viewWidth] = {
					viewWidth,
					imageWidth,
					nearbyWidth,
					distance: Math.round(distance * 100) + '%',
				};
			}

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
			viewWidth: firstItem.viewWidth,
			imageWidth: firstItem.imageWidth,
			nearbyWidth: firstItem.nearbyWidth,
			distance: firstItem.distance,
			viewportRanges: viewportRanges.map(range => range[0] === range[1] ? range[0] : range.join('-')).join(', '),
		});

	});

}
