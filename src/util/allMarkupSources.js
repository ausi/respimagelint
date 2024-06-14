export default function allMarkupSources(image) {
	let sources = readSources(image.markup);
	let imgs = readImgs(image.markup);

	if (imgs.length) {
		sources.push(imgs[0]);
	}

	return sources;
}

function readSources(element) {
	if (element.tag === 'source') {
		return [element];
	}

	return element.children.flatMap(readSources);
}

function readImgs(element) {
	if (element.tag === 'img') {
		return [element];
	}

	return element.children.flatMap(readImgs);
}
