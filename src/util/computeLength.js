export default function(length, viewport) {

	if (!length) {
		return 0;
	}

	if (typeof viewport === 'string') {
		viewport = viewport.split('x', 2).map(parseFloat);
	}

	if (!viewport || !viewport[0] || !viewport[1]) {
		viewport = [0, 0];
	}

	length = length.replace(
		/\d*\.?\d+v(w|h|min|max)/gi,
		(match, unit) => parseFloat(match) * (
			unit === 'w' ? viewport[0] :
			unit === 'h' ? viewport[1] :
			unit === 'min' ? Math.min(viewport[0], viewport[1]) :
			unit === 'max' ? Math.max(viewport[0], viewport[1]) :
			0
		) / 100 + 'px'
	);

	if (length.match(/^\d*\.?\d+px$/)) {
		return Math.round(parseFloat(length));
	}

	if (length.match(/^\d*\.?\d+r?em$/)) {
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
