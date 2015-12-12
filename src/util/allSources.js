export default function allSources(image) {
	let sources = image.data.sources.slice(0);
	if (image.data.img) {
		sources.push(image.data.img);
	}
	return sources;
}
