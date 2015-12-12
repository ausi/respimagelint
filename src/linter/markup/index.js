import duplicateImg from './duplicateImg';
import extra from './extra';
import missingImg from './missingImg';
import sourceSrc from './sourceSrc';
import wrongOrder from './wrongOrder';

export default function(image) {
	duplicateImg(image);
	extra(image);
	missingImg(image);
	sourceSrc(image);
	wrongOrder(image);
}
