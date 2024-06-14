import error from '../../util/error';
import allMarkupSources from '../../util/allMarkupSources';
import allSources from '../../util/allSources';

export default function(image) {

	const markupSources = allMarkupSources(image);

	allSources(image).forEach((item, itemIndex) => {

		let hasAuto = false;
		let hasError = false;

		item.sizes.forEach(({size, media}, index) => {

			// If the first item is set to auto, ignore it
			if (index === 0 && !media && size === 'auto') {
				hasAuto = true;
				return;
			}

			if (size === 'auto') {
				hasError = true;
			}

		});

		let sizesAttr = markupSources[itemIndex] && markupSources[itemIndex].attributes.find(attr => attr.name === 'sizes');
		sizesAttr = sizesAttr && sizesAttr.value;

		if (hasAuto && !hasError && !/^auto(,|$)/i.test(sizesAttr)) {
			hasError = true;
		}

		if (!hasError) {
			return;
		}

		error(__filename, item, {
			sizes: sizesAttr,
		});

	});

}
