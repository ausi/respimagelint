import error from '../../util/error';
import allSources from '../../util/allSources';
import mediaToStringArray from '../../util/mediaToStringArray';
import stripViewportQueries from '../../util/stripViewportQueries';
import mediaMatchesViewport from '../../util/mediaMatchesViewport';
import computeSrcsetWidths from '../../util/computeSrcsetWidths';

const megapixelThreshold = 0.2;
const megapixelGap = 0.75;
const recommendedMinWidth = 256;
const recommendedMaxWidth = 2048;

export default function(image) {

	const errorItems = [];
	const dimensionsBySource = [];
	const viewportWidths = {}

	Object.keys(image.dimensions).forEach(viewport => {

		viewportWidths[viewport.split('x')[0]] = true;

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
			dimensionsBySource[itemIndex] = dimensionsBySource[itemIndex] || {};
			dimensionsBySource[itemIndex][viewport] = imageWidth;

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

			const ratio = ((image.images[srcs[0]] && image.images[srcs[0]].size.width) ? image.images[srcs[0]].size.height / image.images[srcs[0]].size.width : 1) || 1;

			let nearbyWidth = srcs
				.map(src => image.images[src].size.width)
				.filter(Boolean)
				.sort((a, b) => {
					[a, b] = [a, b].map(width => Math.abs(((imageWidth * imageWidth * ratio) - (width * width * ratio)) / 1000000));
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

			const megapixelDistance = Math.abs(((imageWidth * imageWidth * ratio) - (nearbyWidth * nearbyWidth * ratio)) / 1000000);

			if (megapixelDistance > megapixelGap / 2 && (nearbyWidth < recommendedMaxWidth || imageWidth < recommendedMaxWidth)) {
				errorItems[itemIndex] = errorItems[itemIndex] || {};
				errorItems[itemIndex][viewport] = {
					viewport,
					imageWidth,
					nearbyWidth,
					distance: Math.round(distance * 100) + '%',
					megapixelDistance: Math.round(megapixelDistance * 100) / 100 + '',
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

		const srcPaths = [...(item.srcset || [])];
		if (item.src && !srcPaths.includes(item.src)) {
			srcPaths.push(item.src);
		}

		const srcSizes = srcPaths.filter(src => !!image.images[src]).map(src => image.images[src].size);

		error(__filename, item, {
			viewport: firstItem.viewport.replace(/x/g, '×'),
			imageWidth: firstItem.imageWidth,
			nearbyWidth: firstItem.nearbyWidth,
			distance: firstItem.distance,
			megapixelDistance: firstItem.megapixelDistance,
			viewportRanges: viewportRanges.map(range => range[0] === range[1] ? range[0] : range.join('–')).join(', ').replace(/x/g, '×'),
			recommendation: '<br>' + buildRecommendation(dimensionsBySource[itemIndex], srcSizes, Object.keys(viewportWidths).length),
			recommendationContext: image.data.img === item ? '<code>&lt;img srcset=&quot;…&quot;&gt;</code>' : 'the ' + humanReadableIndex(itemIndex) + ' <code>&lt;source srcset=&quot;…&quot;&gt;</code>',
		});

	});

}

function humanReadableIndex(index) {
	index++;
	const ordinal = new Intl.PluralRules('en-US', { type: 'ordinal' }).select(index);
	const suffixes = {
		one: 'st',
		two: 'nd',
		few: 'rd',
		other: 'th',
	};

	return index + suffixes[ordinal];
}

function buildRecommendation(dimensions, sizes, viewportsCount) {
	const ratio = (sizes[0] && sizes[0].width && sizes[0].height) ? sizes[0].height / sizes[0].width : 1;
	return computeSrcsetWidths(dimensions, ratio, viewportsCount, sizes.map(size => size.width).filter(Boolean), {
		recommendedMinWidth,
		recommendedMaxWidth,
		megapixelThreshold,
		megapixelGap,
	}).map(width => width + '<small>×' + Math.round(width * ratio) + '</small>').join(', ');
}
