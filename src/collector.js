import 'whatwg-fetch';
import collector from './collector/index';

const script = document.getElementById('respimagelint-script');
const scriptBase = script.src.split('?')[0].replace(/[^/]+$/, '');

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

		let store = document.createElement('iframe');
		store.src = scriptBase + 'store.html';
		document.body.appendChild(store);

	});

}).then(() => {
	document.location.href = scriptBase + 'linter.html';
}).catch(err => {
	alert(err);
	document.location.reload();
});
