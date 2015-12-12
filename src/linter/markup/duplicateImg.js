import error from '../../util/error';

export default function(image) {
	let imgFound;
	if (image.markup.tag === 'picture') {
		image.markup.children.forEach(child => {
			if (child.tag === 'img') {
				if (imgFound) {
					error(__filename, image.data);
				}
				imgFound = true;
			}
		});
	}
}
