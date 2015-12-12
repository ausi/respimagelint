import error from '../../util/error';

export default function(image) {
	const badTags = [];
	if (image.markup.tag === 'picture') {
		image.markup.children.forEach(child => {
			if (child.tag !== 'source' && child.tag !== 'img' && badTags.indexOf(child.tag) === -1) {
				badTags.push(child.tag);
			}
		});
	}
	if (badTags.length) {
		error(__filename, image.data, {
			tags: badTags.join(', '),
		});
	}
}
