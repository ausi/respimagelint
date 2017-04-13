import allSources from '../../util/allSources';
import duplicate from './duplicate';
import malformed from './malformed';
import mixed from './mixed';
import xAndSizes from './xAndSizes';
import wMissingSizes from './wMissingSizes';
import wrongSize from './wrongSize';
import wrongX from './wrongX';

export default function(image, data) {
	allSources(image).forEach(item => {
		duplicate(item);
		malformed(item);
		mixed(item);
		xAndSizes(item);
		wrongSize(item, image.images);
		wrongX(item, image.images);
	});
	wMissingSizes(image, data.mediaQueries);
}
