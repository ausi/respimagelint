import allSources from '../../util/allSources';
import error from '../../util/error';
import computeSizesAttribute from '../../util/computeSizesAttribute';

export default function(image, mediaQueries) {
	allSources(image).forEach(item => {
		const errorDescriptors = [];
		item.srcset.forEach(({descriptor}) => {
			if (descriptor && descriptor.substr(-1) === 'w' && !item.sizes.length) {
				errorDescriptors.push(descriptor);
			}
		});
		if (errorDescriptors.length) {
			error(__filename, item, {
				descriptors: errorDescriptors.join(', '),
				sizesSuggestion: computeSizesAttribute(image.dimensions, mediaQueries.bySize),
			});
		}
	});
}
