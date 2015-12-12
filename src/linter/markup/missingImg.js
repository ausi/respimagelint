import error from '../../util/error';

export default function(image) {
	if (!image.data.img) {
		error(__filename, image.data);
	}
}
