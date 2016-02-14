import error from '../../util/error';

export default function(item) {
	let descriptors = item.srcset.map(
		({descriptor}) => (descriptor || '1x').replace(/(?:\s+|^)\d+h(?:\s+|$)/, '')
	);
	if (
		descriptors.length > 1
		&& descriptors.map(
			desc => desc.substr(-1)
		).reduce(
			(a, b) => a === b ? a : false
		) === false
	) {
		error(__filename, item, {
			descriptors: descriptors.join(', '),
		});
	}
}
