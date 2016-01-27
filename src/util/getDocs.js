/*global require*/
const docs = JSON.parse(require('fs').readFileSync(__dirname + '/../../tmp/docs.json', 'utf-8'));

export default function getDocs(key, section) {

	let doc = docs[key];

	if (!section) {
		return doc;
	}

	if (section === 'title') {
		return doc.split('\n')[0].substr(2);
	}

	if (section === 'text') {
		doc = doc.split(/^#[^\n]*/);
	}
	else {
		doc = doc.split('\n\n## ' + section + '\n\n');
	}

	if (doc.length < 2) {
		return '';
	}

	return doc[1].split('\n\n##')[0].trim();

}
