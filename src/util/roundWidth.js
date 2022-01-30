export default function roundWidth(width) {
	const powersOfTwo = [];

	for (let i = 2; i <= 1048576; i *= 2) {
		powersOfTwo.push(i);
	}

	const rounded = width < 100 ? width : width < 500 ? Math.round(width / 5) * 5 : Math.round(width / 10) * 10;

	return [rounded, ...powersOfTwo].sort((a, b) => Math.abs(width - a) - Math.abs(width - b))[0];
}
