import mqParser from 'css-mq-parser';

export default function parseMedia(attribute) {
	if (!attribute) {
		return undefined;
	}
	try {
		return mqParser(attribute.toLowerCase().replace(/\s+/g, ' '));
	}
	catch(e) {
		return attribute;
	}
}
