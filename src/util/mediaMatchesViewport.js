import computeLength from './computeLength';

/**
 * Evaluates media queries and returns false if all of them have a non-matching
 * viewport query, otherwise true
 *
 * @param  {array}  media
 * @param  {string} viewport
 * @return {boolean}
 */
export default function(media, viewport) {

	if (!media || typeof media === 'string') {
		return true;
	}

	if (typeof viewport === 'string') {
		viewport = viewport.split('x', 2).map(parseFloat);
	}

	return !!media.filter(({type, expressions, inverse}) => {

		let matches = true;

		expressions.filter(
			({feature}) => feature === 'width' || feature === 'height'
		).forEach(({feature, modifier, value}) => {
			value = computeLength(value, viewport);
			let viewSize = viewport[feature === 'width' ? 0 : 1];
			if (
				(modifier === 'min' && viewSize < value)
				|| (modifier === 'max' && viewSize > value)
				|| (!modifier && viewSize !== value)
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

		expressions.filter(
			({feature}) => feature === 'orientation'
		).forEach(({value}) => {
			if (
				(value === 'portrait' && viewport[0] > viewport[1])
				|| (value === 'landscape' && viewport[0] <= viewport[1])
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

		expressions.filter(
			({feature}) => feature === 'aspect-ratio'
		).forEach(({modifier, value}) => {
			value = value.split('/').map(parseFloat);
			if (!value[0] || !value[1]) {
				return;
			}
			value = value[0] / value[1];
			let viewRatio = viewport[0] / viewport[1];
			if (
				(modifier === 'min' && viewRatio < value)
				|| (modifier === 'max' && viewRatio > value)
				|| (!modifier && viewRatio !== value)
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
