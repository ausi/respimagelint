export default function sameRatio(
	{width: widthA, height: heightA},
	{width: widthB, height: heightB},
	threshold = 0.02,
	thresholdPx = 2
) {

	if (!widthA || !heightA || !widthB || !heightB) {
		return false;
	}

	let aW = Math.round(widthB / heightB * heightA);
	let bW = Math.round(widthA / heightA * heightB);

	return (aW > widthA * (1 - threshold) - thresholdPx && aW < widthA * (1 + threshold) + thresholdPx)
		|| (bW > widthB * (1 - threshold) - thresholdPx && bW < widthB * (1 + threshold) + thresholdPx);

}
