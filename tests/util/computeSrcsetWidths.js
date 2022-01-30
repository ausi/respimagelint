import computeSrcsetWidths from '../../src/util/computeSrcsetWidths';

// Test config from missingFittingSrc linter
var config = {
	megapixelThreshold: 0.2,
	megapixelGap: 0.75,
	recommendedMinWidth: 256,
	recommendedMaxWidth: 2048,
};

test('Basic srcset with single viewport', () => {
	expect(computeSrcsetWidths({'800x600': 400}, 1, 1, [])).toStrictEqual([400, 800]);
});

test('Fluid 100vw square image', () => {
	const dimensions = {};
	for (let viewport = 300; viewport < 3000; viewport+=10) {
		dimensions[viewport+'x'+viewport] = viewport;
	}

	const widths = computeSrcsetWidths(dimensions, 1, Object.keys(dimensions).length, [], config);

	expect(widths).toStrictEqual([300, 880, 1210, 1470, 1680, 1870, 2048]);
});

test('Fluid 100vw square image with existing widths', () => {
	const dimensions = {};
	for (let viewport = 300; viewport < 3000; viewport+=10) {
		dimensions[viewport+'x'+viewport] = viewport;
	}

	const widths = computeSrcsetWidths(dimensions, 1, Object.keys(dimensions).length, [10, 1200, 1999, 9999], config);

	expect(widths).toStrictEqual([300, 880, 1200, 1440, 1650, 1830, 1999]);
});

test('Fluid 50vw square image', () => {
	const dimensions = {};
	for (let viewport = 300; viewport < 3000; viewport+=10) {
		dimensions[viewport+'x'+viewport] = viewport / 2;
	}

	const widths = computeSrcsetWidths(dimensions, 1, Object.keys(dimensions).length, [], config);

	expect(widths).toStrictEqual([256, 890, 1230, 1500, 1700, 1880, 2048]);
});

test('Fluid 100vw 4/1 image', () => {
	const dimensions = {};
	for (let viewport = 300; viewport < 3000; viewport+=10) {
		dimensions[viewport+'x'+viewport] = viewport;
	}

	const widths = computeSrcsetWidths(dimensions, 1 / 4, Object.keys(dimensions).length, [], config);

	expect(widths).toStrictEqual([300, 1460, 2048]);
});

test('Fluid 50vw 4/1 image', () => {
	const dimensions = {};
	for (let viewport = 300; viewport < 3000; viewport+=10) {
		dimensions[viewport+'x'+viewport] = viewport / 2;
	}

	const widths = computeSrcsetWidths(dimensions, 1 / 4, Object.keys(dimensions).length, [], config);

	expect(widths).toStrictEqual([256, 1500, 2048]);
});

test('Fluid 100vw square image max-width 600', () => {
	const dimensions = {};
	for (let viewport = 300; viewport < 3000; viewport+=10) {
		dimensions[viewport+'x'+viewport] = Math.min(600, viewport);
	}

	const widths = computeSrcsetWidths(dimensions, 1, Object.keys(dimensions).length, [], config);

	expect(widths).toStrictEqual([300, 600, 950, 1200]);
});

test('Static 500/1000/1500 square image', () => {
	const dimensions = {};
	for (let viewport = 300; viewport < 3000; viewport+=10) {
		dimensions[viewport+'x'+viewport] = Math.max(500, Math.min(1500, Math.floor(viewport / 500) * 500));
	}

	const widths = computeSrcsetWidths(dimensions, 1, Object.keys(dimensions).length, [], config);

	// TODO: 1280, 1700 and 1880 should be removed for this case
	expect(widths).toStrictEqual([500, 1000, 1280, 1500, 1700, 1880, 2048]);
});
