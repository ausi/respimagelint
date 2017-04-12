import collector from './collector/index';
import linter from './linter/index';

collector(document, true)
	.then(data => {
		data.data.forEach(image => {
			for (
				var node = image.dom.img || image.dom.sources[0];
				node;
				node = node.parentNode
			) {
				if (node.getAttribute('data-test-key') && node.getAttribute('data-test-type')) {
					image.test = {
						key: node.getAttribute('data-test-key'),
						type: node.getAttribute('data-test-type'),
					};
					break;
				}
			}
			delete image.dom;
		});
		return data;
	})
	.then(linter)
	.then(data => {
		window.callPhantom(data.data);
	});
