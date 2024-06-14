import allSources from '../../util/allSources';
import differentContent from './differentContent';
import differentRatio from './differentRatio';
import missingFittingSrc from './missingFittingSrc';
import sameContent from './sameContent';
import sizesAuto from './sizesAuto';
import sizesAutoLazy from './sizesAutoLazy';
import wrongSizes from './wrongSizes';

export default function(image, data) {
	allSources(image).forEach(item => {
		differentRatio(item, image.images);
		differentContent(item, image.images);
	});
	missingFittingSrc(image);
	sameContent(image);
	sizesAuto(image);
	sizesAutoLazy(image);
	wrongSizes(image, data.mediaQueries);
}
