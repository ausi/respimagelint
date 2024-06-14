import error from '../../util/error';
import allSources from '../../util/allSources';

export default function(image) {

	let hasAuto = false;

	allSources(image).forEach((item, itemIndex) => {

		item.sizes.forEach(({size, media}, index) => {
			if (size === 'auto') {
				hasAuto = true;
			}
		});

	});

	if (hasAuto && (image.data.img && image.data.img.loading) !== 'lazy') {
		error(__filename, image.data);
	}

}
