export default function setStyles(element, styles, important = true) {
	Object.keys(styles).forEach(prop => {
		element.style.setProperty(prop, styles[prop], important ? 'important' : '');
	})
}
