import descriptors from './descriptors';
import fallbacks from './fallbacks';
import images from './images';
import markup from './markup';

export default function(data) {

	data.forEach(image => {
		descriptors(image);
		fallbacks(image);
		images(image);
		markup(image);
	});

	return data;

}
