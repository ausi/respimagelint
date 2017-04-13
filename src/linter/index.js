import prepareMediaQueries from './prepareMediaQueries';
import descriptors from './descriptors';
import fallbacks from './fallbacks';
import images from './images';
import markup from './markup';

export default function(data) {

	prepareMediaQueries(data);

	data.data.forEach(image => {
		descriptors(image, data);
		fallbacks(image);
		images(image, data);
		markup(image);
	});

	return data;

}
