export default function find(document) {

	let images = [];

	Array.from(document.querySelectorAll('img')).forEach(img => {

		let image = {
			dom: {
				img,
				sources: [],
			},
		};

		for (let node = img.parentNode; node; node = node.parentNode) {
			if (node.tagName === 'PICTURE') {
				image.dom.picture = node;
				break;
			}
		}

		if (image.dom.picture) {
			image.dom.sources = Array.from(
				image.dom.picture.querySelectorAll('source')
			);
		}

		images.push(image);

	});

	Array.from(document.querySelectorAll('picture')).forEach(picture => {
		// Add picture elements with missing img tag
		if (!picture.querySelector('img')) {
			images.push({
				dom: {
					picture,
					sources: Array.from(
						picture.querySelectorAll('source')
					),
				},
			});
		}
	});

	return images;
}
