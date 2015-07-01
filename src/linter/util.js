export function error(msg, item, data) {
	item.errors = item.errors || [];
	item.errors.push({msg, data});
}

export function allSources(image) {
	let sources = image.data.sources.slice(0);
	if (image.data.img) {
		sources.push(image.data.img);
	}
	return sources;
}
