import {sep as pathSeparator} from 'path';
import getDocs from './getDocs';

export default function error(filename, item, data = {}) {
	let key = filename.substr(1, filename.length - 4).split(pathSeparator);
	key.shift();
	key.shift();
	key = key.join('.');
	let doc = getDocs(key);
	let msg = doc.split('\n')[0].substr(2);
	item.errors = item.errors || [];
	item.errors.push({key, msg, data});
}
