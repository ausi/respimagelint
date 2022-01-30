import roundWidth from './roundWidth';

export default function computeSrcsetWidths(dimensions, ratio, viewportsCount, existingWidths, {
	recommendedMinWidth = 0,
	recommendedMaxWidth = 16384,
	megapixelThreshold = 0.25,
	megapixelGap = 0.5,
} = {}) {
	const maxWidth = Math.min(recommendedMaxWidth, Math.round(Math.max(...Object.values(dimensions))));
	const minWidth = Math.min(maxWidth, Math.max(recommendedMinWidth, Math.round(Math.min(...Object.values(dimensions).filter(width => width > 0)))));
	const fixedWidths = [];
	const widthCounts = {};

	Object.values(dimensions).forEach(width => {
		widthCounts[width] = widthCounts[width] || 0;
		widthCounts[width]++;
	});

	// If the image size is fixed (not fluid) for some viewports, these exact dimensions (including retina versions) should be used
	Object.keys(widthCounts).forEach(width => {
		width = parseInt(width);
		if (widthCounts[width] > viewportsCount / 8) {
			[
				Math.min(recommendedMaxWidth, width),
				Math.min(recommendedMaxWidth, width * 2),
			].forEach(width => {
				if (!fixedWidths.includes(width)) {
					fixedWidths.push(width);
				}
			});
		}
	});

	fixedWidths.push(...existingWidths.filter(width => width >= minWidth && width <= maxWidth * 2));

	fixedWidths.sort((a, b) => a < b ? -1 : 1);

	if (!fixedWidths[0] || getMegapixels(minWidth) < getMegapixels(fixedWidths[0]) - megapixelThreshold) {
		fixedWidths.unshift(roundWidth(minWidth));
	}

	if (getMegapixels(maxWidth) > getMegapixels(fixedWidths[fixedWidths.length - 1]) + megapixelThreshold) {
		fixedWidths.push(roundWidth(maxWidth));
	}

	if (getMegapixels(Math.min(recommendedMaxWidth, maxWidth * 2)) > getMegapixels(fixedWidths[fixedWidths.length - 1]) + megapixelThreshold) {
		fixedWidths.push(Math.min(recommendedMaxWidth, roundWidth(maxWidth * 2)));
	}

	const allWidths = [];

	fixedWidths.reverse().forEach((width, index) => {
		const previousWidth = allWidths[allWidths.length - 1];
		const gap = previousWidth && getMegapixels(previousWidth) - getMegapixels(width);
		if (gap < megapixelThreshold) {
			return;
		}
		else if (gap > megapixelGap) {
			const gapSize = gap / Math.ceil(gap / megapixelGap);
			let nextWidth = previousWidth;
			while (width + 10 < (nextWidth = getWidth(getMegapixels(nextWidth) - gapSize))) {
				allWidths.push(roundWidth(nextWidth));
			}
		}
		allWidths.push(width);
	});

	return allWidths.reverse();

	function getMegapixels(width) {
		return width * width * ratio / 1000000;
	}

	function getWidth(megapixels) {
		return Math.round(Math.sqrt(megapixels * 1000000 / ratio));
	}
}
