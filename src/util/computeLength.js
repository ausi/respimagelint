export default function(length, viewWidth = 0) {

	if (!length) {
		return 0;
	}

	length = length.replace(
		/\d*\.?\d+v(?:w|h|min|max)/gi,
		match => parseFloat(match) * viewWidth / 100 + 'px'
	);

	if (length.match(/^\d*\.?\d+px$/)) {
		return Math.round(parseFloat(length));
	}

	if (length.match(/^\d*\.?\d+em$/)) {
		return Math.round(parseFloat(length) * 16);
	}

	const wrap = document.createElement('div');
	wrap.style.width = 0;
	wrap.style.fontSize = '16px';

	const element = document.createElement('div');
	element.style.width = length;

	wrap.appendChild(element);
	document.body.appendChild(wrap);

	const result = element.offsetWidth;

	document.body.removeChild(wrap);

	return result;

}
