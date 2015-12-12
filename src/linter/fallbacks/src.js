import error from '../../util/error';

export default function(image) {
	if (image.data.img && !image.data.img.src) {
		error(__filename, image.data.img);
	}
}
