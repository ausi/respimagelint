/**
 * @param  {string} componentValuesString
 * @return {array}
 */
export default function(componentValuesString) {

	const matchToken = /[,()"']/g;
	const componentValues = [];
	let start = 0
	let depth = 0;

	let token;
	while (token = matchToken.exec(componentValuesString)) {
		if (token[0] === ',' && depth === 0) {
			componentValues.push(componentValuesString.substring(start, matchToken.lastIndex - 1).trim());
			start = matchToken.lastIndex;
		}
		if (token[0] === '(') {
			++depth;
		}
		if (token[0] === ')' && depth > 0) {
			--depth;
		}
		if (token[0] === '"' || token[0] === '\'') {
			// Skip to end of string
			matchToken.lastIndex = componentValuesString.indexOf(token[0], matchToken.lastIndex);
			if (matchToken.lastIndex === -1) {
				break;
			}
		}
	}

	componentValues.push(componentValuesString.substring(start).trim());

	return componentValues;

}
