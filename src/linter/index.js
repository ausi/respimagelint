import descriptors from './descriptors';
import fallbacks from './fallbacks';
import images from './images';

export default function(data) {

	data.forEach(image => {
		descriptors(image);
		fallbacks(image);
		images(image);
	});

	return data;

}
