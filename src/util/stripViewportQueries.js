import cloneDeep from 'lodash/cloneDeep';

/**
 * Strips viewport queries that can be evaluated by mediaMatchesViewport()
 *
 * @param  {array} media [description]
 * @return {array}
 */
export default function(media) {
	if (!media || typeof media === 'string') {
		return media;
	}
	return cloneDeep(media).map(item => {
		item.expressions = item.expressions.filter(
			({feature}) => feature !== 'width'
		);
		if (!item.expressions.length && item.type === 'all' && item.inverse) {
			item.inverse = false;
		}
		return item;
	});
}
