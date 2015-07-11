import descriptors from './descriptors';
import fallbacks from './fallbacks';

export default function(data) {

	data.forEach(image => {
		descriptors(image);
		fallbacks(image);
	});

	return data;

}
