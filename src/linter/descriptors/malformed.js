import error from '../../util/error';

export default function(item) {
	item.srcset.forEach(({descriptor}) => {
		if (
			descriptor
			&& !descriptor.match(/^\d+(?:\.\d+)?x$/)
			&& !descriptor.match(/^\d+w$/)
			&& !descriptor.match(/^\d+w\s+\d+h$/)
			&& !descriptor.match(/^\d+h\s+\d+w$/)
		) {
			error(__filename, item, {
				descriptor,
			});
		}
	});
}
