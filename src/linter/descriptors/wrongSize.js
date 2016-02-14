import error from '../../util/error';

export default function(item, images) {
	item.srcset.forEach(({src, descriptor}) => {
		(descriptor && descriptor.split(/\s+/) || []).forEach(descriptor => {
			if ((
				descriptor.substr(-1) === 'w'
				&& images[src].size.width
				&& parseInt(descriptor) !== images[src].size.width
			) || (
				descriptor.substr(-1) === 'h'
				&& images[src].size.height
				&& parseInt(descriptor) !== images[src].size.height
			)) {
				error(__filename, item, {
					descriptor,
					image: src,
				});
			}
		});
	});
}
