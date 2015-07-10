import collector from './collector/index';

collector(document).then(data => {

	window.RespImageLintData = data;

	//console.log(JSON.stringify(window.RespImageLintData, undefined, 2));

	let linterScript = document.createElement('script');
	linterScript.type = 'text/javascript';
	linterScript.src = 'http://respimagelint.127.0.0.1.xip.io/dist/linter.js';
	document.body.appendChild(linterScript);

});
