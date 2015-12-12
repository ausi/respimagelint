import error from '../../util/error';

export default function(image) {
	if (image.markup.tag === 'picture') {
		image.markup.children.forEach(child => {
			if (child.tag === 'source' && child.attributes.filter(attr => attr.name === 'src').length) {
				error(__filename, image.data);
			}
		});
	}
}
