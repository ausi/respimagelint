import computeLength from './computeLength';

/**
 * Evaluates media queries and returns false if all of them have a non-matching
 * viewport query, otherwise true
 *
 * @param  {array}  media
 * @param  {number} viewport
 * @return {boolean}
 */
export default function(media, viewport) {
	if (!media || typeof media === 'string') {
		return true;
	}
	viewport = parseFloat(viewport);
	return !!media.filter(({type, expressions, inverse}) => {
		let matches = true;
		expressions.filter(
			({feature}) => feature === 'width'
		).forEach(({modifier, value}) => {
			value = computeLength(value);
			if (
				(modifier === 'min' && viewport < value)
				|| (modifier === 'max' && viewport > value)
				|| (!modifier && viewport !== value)
			) {
				if (!inverse) {
					matches = false;
				}
			}
			else {
				if (inverse) {
					matches = false;
				}
			}
		});
		return matches;
	}).length;
}
