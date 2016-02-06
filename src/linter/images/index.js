import allSources from '../../util/allSources';
import differentContent from './differentContent';
import differentRatio from './differentRatio';
import sameContent from './sameContent';
import wrongSizes from './wrongSizes';

export default function(image) {
	allSources(image).forEach(item => {
		differentRatio(item, image.images);
		differentContent(item, image.images);
	});
	sameContent(image);
	wrongSizes(image);
}
