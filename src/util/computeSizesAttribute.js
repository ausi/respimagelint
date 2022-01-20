const threshold = 0.05;

export default function computeSizesAttribute(allDimensions, queriesBySize) {

	const byViewport = {};

	Object.keys(allDimensions).forEach(viewport => {
		if (!byViewport[viewport.split('x')[0]] && allDimensions[viewport]) {
			byViewport[viewport.split('x')[0]] = allDimensions[viewport];
		}
	});

	const ranges = [];
	let currentRange;

	Object.keys(byViewport).map(Number).sort((a, b) => a - b).forEach(viewport => {

		const width = byViewport[viewport];

		// First item
		if (!currentRange) {
			currentRange = {
				fixed: width,
				variable: 0,
				viewports: [viewport],
			};
			return;
		}

		const firstViewport = currentRange.viewports[0];
		const firstWidth = byViewport[firstViewport];
		const tryRange = {
			variable: (width - firstWidth) / (viewport - firstViewport),
		};
		tryRange.fixed = width - (viewport * tryRange.variable);

		// Extend current range if possible
		if (!currentRange.viewports.filter(
			viewport => !isInThreshold(calculate(viewport, tryRange), byViewport[viewport])
		).length) {
			currentRange.variable = tryRange.variable;
			currentRange.fixed = tryRange.fixed;
			currentRange.viewports.push(viewport);
			return;
		}

		// Start a new range
		ranges.push(currentRange);
		currentRange = {
			fixed: width,
			variable: 0,
			viewports: [viewport],
		};

	});

	// Add last range
	ranges.push(currentRange);

	// Start with the biggest viewport
	ranges.reverse();

	return ranges.map(({fixed, variable, viewports}, index) => {
		let result = '';
		const vw = (Math.round(variable * 10000) / 100) + 'vw';
		const px = Math.round(Math.abs(fixed)) + 'px';
		if (ranges[index + 1]) {
			result += '(min-width: ' + viewports[0] + 'px) ';
		}
		if (Math.abs(fixed) < viewports[0] * Math.abs(variable) * threshold) {
			result += vw;
		}
		else if (viewports[0] * Math.abs(variable) < Math.abs(fixed) * threshold) {
			result += px;
		}
		else {
			result += 'calc(' + vw + ' ' + (fixed < 0 ? '-' : '+') + ' ' + px + ')';
		}
		return result;
	}).join(', ');

}

function calculate(viewport, {variable, fixed}) {
	return viewport * variable + fixed;
}

function isInThreshold(value, width) {
	return value > width * (1 - threshold) && value < width * (1 + threshold);
}
