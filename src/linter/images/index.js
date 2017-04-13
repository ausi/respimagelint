import allSources from '../../util/allSources';
import differentContent from './differentContent';
import differentRatio from './differentRatio';
import missingFittingSrc from './missingFittingSrc';
import sameContent from './sameContent';
import wrongSizes from './wrongSizes';

export default function(image, data) {
	allSources(image).forEach(item => {
		differentRatio(item, image.images);
		differentContent(item, image.images);
	});
	missingFittingSrc(image);
	sameContent(image);
	wrongSizes(image, data.mediaQueries);
}
