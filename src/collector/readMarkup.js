export default function readMarkup(image) {
	image.markup = readNode(image.dom.picture || image.dom.img);
	return image;
}

function readNode(node) {
	return {
		tag: node.tagName.toLowerCase(),
		attributes: readAttributes(node),
		children: Array.from(node.children).map(readNode),
	};
}

function readAttributes(node) {
	return Array.from(node.attributes).map(({name, value}) => ({name, value}));
}
