import {error} from '../util';

export default function(image) {
	if (image.data.img && !image.data.img.src) {
		error(__filename, image.data.img);
	}
}
