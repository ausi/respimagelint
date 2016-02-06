import error from '../../util/error';

const threshold = 0.02;
const thresholdPx = 2;

export default function(item, images) {

	const base = item.srcset.filter(
		({descriptor}) => !descriptor || descriptor.substr(-1) === 'x'
	).sort(
		({descriptor: a}, {descriptor: b}) => Math.abs(parseFloat(a || 1) - 1) - Math.abs(parseFloat(b || 1) - 1)
	)[0];

	if (!base) {
		return;
	}

	let baseWidth = images[base.src].size.width;
	let baseX = parseFloat(base.descriptor || 1);

	if (baseX !== 1 && item.src) {
		baseWidth = images[item.src].size.width;
		baseX = 1;
	}

	item.srcset.forEach(({src, descriptor}) => {
		if (descriptor && descriptor.substr(-1) !== 'x') {
			return;
		}
		const multiplier = parseFloat(descriptor || 1) / baseX;
		if (
			baseWidth * multiplier * (1 - threshold) - thresholdPx > images[src].size.width
			|| baseWidth * multiplier * (1 + threshold) + thresholdPx < images[src].size.width
		) {
			error(__filename, item, {
				descriptor,
				correctWidth: Math.round(baseWidth * multiplier),
				correctDescriptor: Math.round(images[src].size.width / (baseWidth / baseX) * 100) / 100 + 'x',
				image: src,
			});
		}
	});

}
