import setStyles from '../util/setStyles';

const lazyAttributes = [
	'data-src',
	'data-srcset',
	'data-sizes',
	'data-original',
	'data-original-set',
	'data-pagespeed-lazy-src',
];

export default function checkLazyImages(iframe) {

	return new Promise((resolve) => {

		const lazyElements = iframe.contentWindow.document.querySelectorAll([
			...lazyAttributes.map(attr => 'img[' + attr +']'),
			...lazyAttributes.map(attr => 'picture > source[' + attr +']'),
		].join(','));

		if (!lazyElements.length) {
			resolve();
			return;
		}

		setStyles(iframe, {
			height: iframe.contentWindow.document.body.scrollHeight + 'px',
		});

		setTimeout(resolve, 5000);

	});

}
