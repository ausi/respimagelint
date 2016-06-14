import error from '../../util/error';
import allSources from '../../util/allSources';
import mediaToStringArray from '../../util/mediaToStringArray';
import stripViewportQueries from '../../util/stripViewportQueries';
import mediaMatchesViewport from '../../util/mediaMatchesViewport';

const threshold = 0.5;

export default function(image) {

	const errorItems = [];

	Object.keys(image.dimensions).forEach(viewport => {

		let imageWidth = image.dimensions[viewport];
		const sourceMatched = {};
		allSources(image).forEach((item, itemIndex) => {

			const categories = mediaToStringArray(
				stripViewportQueries(item.media)
			).map(
				media => (item.type || 'image/*') + '|' + media
			);

			if (categories.reduce((result, category) => result || sourceMatched[category], false)) {
				return;
			}

			if (item.type === 'image/svg+xml' || !imageWidth) {
				return;
			}

			if (item.media && !mediaMatchesViewport(item.media, viewport)) {
				return;
			}
			categories.forEach(category => {
				sourceMatched[category] = true;
			});

			let srcs = item.srcset.map(({src}) => src);

			if (item.src && !item.srcset.filter(({descriptor = '1x'}) =>
				descriptor.substr(-1) !== 'x' || descriptor === '1x'
			).length) {
				srcs.push(item.src);
			}

			// Skip if one candidate is a vector image
			if (srcs.map(src => image.images[src].type).indexOf('image/svg+xml') !== -1) {
				return;
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
				errorItems[itemIndex][viewport] = {
					viewport,
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
				'1280x720', '1440x810', '1000x563', '320x427', '480x270', '1920x1080',
				Object.keys(errorItems[itemIndex])[0],
			].filter(
				viewport => errorItems[itemIndex][viewport]
			)[0]
		];

		let viewportRanges = [];
		let lastViewWidth = 0;

		Object.keys(errorItems[itemIndex]).forEach(viewport => {
			let viewWidth = viewport.split('x')[0];
			if (Math.abs(lastViewWidth - viewWidth) > 20) {
				viewportRanges.push([viewport, viewport]);
			}
			viewportRanges[viewportRanges.length - 1][1] = viewport;
			lastViewWidth = viewWidth;
		});

		for (let i = 0; i < viewportRanges.length; i++) {
			for (let j = i + 1; j < viewportRanges.length; j++) {
				if (
					viewportRanges[i]
					&& viewportRanges[j]
					&& viewportRanges[i][0].split('x')[0] === viewportRanges[j][0].split('x')[0]
					&& viewportRanges[i][1].split('x')[0] === viewportRanges[j][1].split('x')[0]
				) {
					viewportRanges[i][1] = viewportRanges[j][1];
					viewportRanges[j] = undefined;
				}
			}
		}

		viewportRanges = viewportRanges.filter(Boolean);

		error(__filename, item, {
			viewport: firstItem.viewport,
			imageWidth: firstItem.imageWidth,
			nearbyWidth: firstItem.nearbyWidth,
			distance: firstItem.distance,
			viewportRanges: viewportRanges.map(range => range[0] === range[1] ? range[0] : range.join('-')).join(', '),
		});

	});

}
