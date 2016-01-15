import allSources from '../../util/allSources';
import differentContent from './differentContent';
import differentRatio from './differentRatio';

export default function(image) {
	allSources(image).forEach(item => {
		differentRatio(item, image.images);
		differentContent(item, image.images);
	});
}
