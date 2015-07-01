import 'babelify/polyfill';
import find from './collector/find';
import readData from './collector/readData';
import readMarkup from './collector/readMarkup';
import readDimensions from './collector/readDimensions';

let iframe = document.createElement('iframe');
iframe.src = document.location.href + (document.location.search ? '&' : '?');
iframe.style.position = 'absolute';
iframe.style.top = 0;
iframe.style.left = 0;
iframe.addEventListener('load', () => {

	let data = find(iframe.contentWindow.document)
		.map(readData)
		.map(readMarkup);

	readDimensions(iframe, data).then(() => {

		//iframe.parentNode.removeChild(iframe);

		window.RespImageLintData = JSON.parse(JSON.stringify(data));

		//console.log(JSON.stringify(window.RespImageLintData, undefined, 2));

		var linterScript = document.createElement('script');
		linterScript.type = 'text/javascript';
		linterScript.src = 'http://respimagelint.127.0.0.1.xip.io/dist/linter.js';
		document.body.appendChild(linterScript);

	});

});

document.body.appendChild(iframe);
