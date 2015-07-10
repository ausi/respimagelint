import {allSources} from '../util';
import duplicate from './duplicate';
import malformed from './malformed';
import mixed from './mixed';
import xAndSizes from './xAndSizes';

export default function checkDescriptors(image) {
	allSources(image).forEach(item => {
		duplicate(item);
		malformed(item);
		mixed(item);
		xAndSizes(item);
	});
}
