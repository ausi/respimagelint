/**
 * Returns an array with strings for each media query, `all` is represented as
 * an empty string, media conditions are sorted
 *
 * @param  {array} media
 * @return {array}
 */
export default function(media) {
	if (!media || !media.length) {
		return [''];
	}
	if (typeof media === 'string') {
		return [media];
	}
	return media.map(({type, expressions, inverse}) => {
		let string = inverse ? 'not ' : '';
		string += (type === 'all' && !inverse) ? '' : type;
		if (expressions.length && string) {
			string += ' and ';
		}
		string += expressions.map(({feature, modifier, value}) =>
			'('
			+ (modifier ? modifier + '-' : '')
			+ feature
			+ (value ? ': ' + value : '')
			+ ')'
		).sort().join(' and ');
		return string;
	});
}
