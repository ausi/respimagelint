import error from '../../util/error';
import allSources from '../../util/allSources';
import mediaToStringArray from '../../util/mediaToStringArray';
import stripViewportQueries from '../../util/stripViewportQueries';
import mediaMatchesViewport from '../../util/mediaMatchesViewport';

const threshold = 0.5;
const megapixelThreshold = 0.5;
const megapixelGap = 0.75;

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

		const imageSrc = item.srcset[0] ? item.srcset[0].src : item.src;

		error(__filename, item, {
			viewport: firstItem.viewport,
			imageWidth: firstItem.imageWidth,
			nearbyWidth: firstItem.nearbyWidth,
			distance: firstItem.distance,
			viewportRanges: viewportRanges.map(range => range[0] === range[1] ? range[0] : range.join('-')).join(', '),
			recommendation: '<br>' + buildRecommendation(dimensionsBySource[itemIndex], image.images[imageSrc] ? image.images[imageSrc].size : {}, Object.keys(viewportWidths).length),
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

function buildRecommendation(dimensions, size, viewportsCount) {
	const ratio = (size.width && size.height) ? size.height / size.width : 1;
	return calculateSuggestedDimenions(dimensions, ratio, viewportsCount).map(width => width + '<small>×' + Math.round(width * ratio) + '</small>').join(', ');
}

function calculateSuggestedDimenions(dimensions, ratio, viewportsCount) {
	const maxWidth = Math.round(Math.max(...Object.values(dimensions)));
	const minWidth = Math.round(Math.min(...Object.values(dimensions).filter(width => width > 0)));
	const fixedWidths = [];
	const widthCounts = {};

	Object.values(dimensions).forEach(width => {
		widthCounts[width] = widthCounts[width] || 0;
		widthCounts[width]++;
	});

	// If the image size is fixed (not fluid) for some viewports, these exact dimensions (including retina versions) should be used
	Object.keys(widthCounts).forEach(width => {
		width = parseInt(width);
		if (widthCounts[width] > viewportsCount / 8 && !fixedWidths.includes(width)) {
			fixedWidths.push(width);
			fixedWidths.push(width * 2);
		}
	});

	fixedWidths.sort((a, b) => a < b ? -1 : 1);
	const allWidths = [];

	if (!fixedWidths[0] || getMegapixels(minWidth) < getMegapixels(fixedWidths[0]) - megapixelThreshold) {
		fixedWidths.unshift(minWidth);
	}

	if (getMegapixels(maxWidth) > getMegapixels(fixedWidths[fixedWidths.length - 1]) + megapixelThreshold) {
		fixedWidths.push(maxWidth);
	}

	if (getMegapixels(maxWidth * 2) > getMegapixels(fixedWidths[fixedWidths.length - 1]) + megapixelThreshold) {
		fixedWidths.push(maxWidth * 2);
	}

	fixedWidths.forEach((width, index) => {
		const previousWidth = allWidths[allWidths.length - 1];
		const gap = previousWidth && getMegapixels(width) - getMegapixels(previousWidth);
		if (gap < megapixelThreshold) {
			allWidths.pop();
		}
		else if (gap > megapixelGap) {
			const gapSize = gap / Math.ceil(gap / megapixelGap);
			let nextWidth = previousWidth;
			while (width - 10 > (nextWidth = getWidth(getMegapixels(nextWidth) + gapSize))) {
				allWidths.push(nextWidth);
			}
		}
		allWidths.push(width);
	});

	return allWidths;

	function getMegapixels(width) {
		return width * width * ratio / 1000000;
	}

	function getWidth(megapixels) {
		return Math.round(Math.sqrt(megapixels * 1000000 / ratio));
	}
}
