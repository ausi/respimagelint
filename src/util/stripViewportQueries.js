import cloneDeep from 'lodash/cloneDeep';

const viewportFeatures = ['width', 'height', 'aspect-ratio', 'orientation'];

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
			({feature}) => viewportFeatures.indexOf(feature) === -1
		);
		if (!item.expressions.length && item.type === 'all' && item.inverse) {
			item.inverse = false;
		}
		return item;
	});
}
