import error from '../../util/error';

export default function(item) {
	item.srcset.forEach(({descriptor}) => {
		if (descriptor && descriptor.substr(-1) === 'w' && !item.sizes.length) {
			error(__filename, item, {
				descriptor,
			});
		}
	});
}
