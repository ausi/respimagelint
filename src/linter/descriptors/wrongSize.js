import {error} from '../util';

export default function(item, images) {
	item.srcset.forEach(({src, descriptor}) => {
		if (
			descriptor
			&& descriptor.substr(-1) === 'w'
			&& images[src].size.width
			&& parseInt(descriptor) !== images[src].size.width
		) {
			error(__filename, item, [descriptor, images[src].size.width]);
		}
	});
}
