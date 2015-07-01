import {error, allSources} from '../util';

function checkItem(item) {
	let descriptors = [];
	for (let source of item.srcset) {
		let {descriptor, src} = source;
		if (!descriptor) {
			descriptor = '1x';
		}
		if (!descriptor.match(/^\d+(?:\.\d+)?[wx]$/)) {
			error('descriptors.malformed', item, descriptor);
			continue;
		}
		if (descriptor.substr(-1) === 'x' && item.sizes.length) {
			error('descriptors.no-x-sizes', item, descriptor);
		}
		if (descriptors.indexOf(descriptor) !== -1) {
			error('descriptors.unique', item, descriptor);
		}
		descriptors.push(descriptor);
	}
	if (descriptors.length > 1 && descriptors.map(desc => desc.substr(-1)).reduce((a, b) => a === b ? a : false) === false) {
		error('descriptors.mixed', item, descriptors);
	}
}

export default function checkDescriptors(image) {
	allSources(image).forEach(checkItem);
}
