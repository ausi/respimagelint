import {error} from '../util';

export default function(item) {
	item.srcset.forEach(({descriptor}) => {
		if ((!descriptor || descriptor.substr(-1) === 'x') && item.sizes.length) {
			error(__filename, item, descriptor);
		}
	});
}
