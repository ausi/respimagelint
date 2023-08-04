import 'whatwg-fetch';
import collector from './collector/index';
import setStyles from './util/setStyles';

const script = document.getElementById('respimagelint-script');
const scriptBase = script ? script.src.split('?')[0].replace(/[^/]+$/, '') : 'https://ausi.github.io/respimagelint/';
let iframe;

collector(document).then(data => {

	data.href = document.location.href;

	return new Promise(resolve => {

		window.addEventListener('message', function(event) {
			if (event.data === 'respImageLintStoreReady') {
				event.source.postMessage(JSON.stringify(data), '*');
			}
			if (event.data === 'respImageLintStoreDone') {
				resolve();
			}
		});

		setStyles(document.body, {overflow: 'hidden'});
		setStyles(document.documentElement, {overflow: 'hidden'});

		iframe = document.createElement('iframe');
		setStyles(iframe, {
			position: 'fixed',
			top: '5vh',
			left: '5vw',
			'z-index': 2147483647,
			width: '90vw',
			'max-width': 'none',
			'min-width': 0,
			height: '90vh',
			'max-height': 'none',
			'min-height': 0,
			border: 0,
			'border-radius': '10px',
			background: '#fff',
			'box-shadow': '0 25px 50px rgba(0, 0, 0, 0.6)',
			'overscroll-behavior': 'contain',
		});

		iframe.src = scriptBase + 'store.html';
		document.body.appendChild(iframe);
	});

}).then(() => {
	iframe.src = scriptBase + 'linter.html';
}).catch(err => {
	alert(err);
	document.location.reload();
});
