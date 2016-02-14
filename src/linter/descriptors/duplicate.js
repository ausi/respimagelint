import error from '../../util/error';

export default function(item) {
	let descriptors = item.srcset.map(
		({descriptor}) => (descriptor || '1x').replace(/(?:\s+|^)\d+h(?:\s+|$)/, '')
	);
	descriptors.forEach((descriptor, index) => {
		if (descriptors.indexOf(descriptor) !== index) {
			error(__filename, item, {
				descriptor,
				image1: item.srcset[descriptors.indexOf(descriptor)].src,
				image2: item.srcset[index].src,
			});
		}
	});
}
