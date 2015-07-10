import {error} from '../util';

export default function(item) {
	let descriptors = item.srcset.map(({descriptor}) => (descriptor || '1x'));
	descriptors.forEach((descriptor, index) => {
		if (descriptors.indexOf(descriptor) !== index) {
			error(__filename, item, descriptor);
		}
	});
}
