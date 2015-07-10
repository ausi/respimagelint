import {sep as pathSeparator} from 'path';

export function error(filename, item, data) {
	let msg = filename.substr(1, filename.length - 4).split(pathSeparator);
	msg.shift();
	msg.shift();
	msg = msg.join('.');
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
