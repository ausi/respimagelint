import descriptors from './descriptors';

export default function(data) {

	data.forEach(image => {
		descriptors(image);
	});

	let errors = [];

	data.forEach(image => {
		if (image.data.img && image.data.img.errors) {
			errors.push(image.data.img.errors);
		}
		image.data.sources.forEach(source => {
			if (source.errors) {
				errors.push(source.errors);
			}
		});
	});

	console.log(JSON.stringify(errors, undefined, 2));
	console.log(JSON.stringify(data, undefined, 2));

}
