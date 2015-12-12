window.addEventListener('message', function(event) {
	localStorage.respImageLintData = event.data;
	event.source.postMessage('respImageLintStoreDone', '*');
});

if (window.parent && window.parent !== window) {
	window.parent.postMessage('respImageLintStoreReady', '*');
}
