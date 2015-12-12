import error from '../../util/error';

export default function(image) {
	let imgFound;
	if (image.markup.tag === 'picture') {
		image.markup.children.forEach(child => {
			if (child.tag === 'img') {
				imgFound = true;
			}
			else if (child.tag === 'source' && imgFound) {
				error(__filename, image.data);
			}
		});
	}
}
