import parseMedia from '../util/parseMedia';
import computeLength from '../util/computeLength';

export default function prepareMediaQueries(data) {

	const queriesBySize = {};

	data.mediaQueries.forEach(queryString => {
		(parseMedia(queryString) || []).forEach(query => {
			(query.expressions || []).forEach(({feature, modifier, value}) => {
				let size = computeLength(value);
				if (feature !== 'width' || !size || (modifier !== 'min' && modifier !== 'max')) {
					return;
				}
				if (modifier === 'max') {
					size++;
				}
				queriesBySize[size] = {feature, modifier, value};
			});
		});
	});

	data.mediaQueries = {
		bySize: queriesBySize,
	};

}
