import error from '../../util/error';

// Valid child elements for `<picture>` according to
// https://html.spec.whatwg.org/multipage/embedded-content.html#the-picture-element
const validChildren = [
	'source',
	'img',
	'script',
	'template',
];

export default function(image) {
	const badTags = [];
	if (image.markup.tag === 'picture') {
		image.markup.children.forEach(child => {
			if (validChildren.indexOf(child.tag) === -1 && badTags.indexOf(child.tag) === -1) {
				badTags.push(child.tag);
			}
		});
	}
	if (badTags.length) {
		error(__filename, image.data, {
			tags: badTags.join(', '),
		});
	}
}
