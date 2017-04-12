export default function readMediaQueries(document, data) {

	return Promise.resolve().then(() => {

		let queries = {};

		[...document.styleSheets].forEach(function(sheet) {

			try {
				if (!sheet.cssRules.length) {
					return;
				}
			}
			catch(e) {
				// Ignore access errors
				return;
			}

			for (var i = 0; i < sheet.cssRules.length; i++) {
				try {
					parseRule(sheet.cssRules[i], queries);
				}
				catch(e) {
					// Ignore errors.
				}
			}

		});

		data.mediaQueries = Object.keys(queries);

	});

}

function parseRule(rule, queries) {

	if (rule.media && rule.media.length) {
		[...rule.media].forEach(media => queries[media] = true);
	}

	if (rule.cssRules) {
		for (var i = 0; i < rule.cssRules.length; i++) {
			parseRule(rule.cssRules[i], queries);
		}
	}

}
