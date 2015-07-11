import descriptors from './descriptors';

export default function(data) {

	data.forEach(image => {
		descriptors(image);
	});

	return data;

}
