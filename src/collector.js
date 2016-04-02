import collector from './collector/index';

const script = document.getElementById('respimagelint-script');
const scriptHost = script.src.split('/', 3).join('/');

collector(document).then(data => {

	data = {
		href: document.location.href,
		data,
	};

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
		store.src = scriptHost + '/dist/store.html';
		document.body.appendChild(store);

	});

}).then(() => {
	document.location.href = scriptHost + '/dist/linter.html';
}).catch(err => {
	alert(err);
	document.location.reload();
});
