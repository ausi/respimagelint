import allSources from '../../util/allSources';
import differentContent from './differentContent';
import differentRatio from './differentRatio';

export default function(image) {
	allSources(image).forEach(item => {
		differentContent(item, image.images);
		differentRatio(item, image.images);
	});
}
