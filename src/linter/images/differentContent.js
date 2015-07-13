import {error} from '../util';

const threshold = 265;

export default function(item, images) {
	let sources = [];
	if (item.src) {
		sources.push(item.src);
	}
	item.srcset.forEach(({src}) => sources.push(src));
	sources.forEach(src => {
		if (!images[src].hash) {
			return;
		}
		sources.forEach(src2 => {
			if (
				src2 !== src
				&& images[src2].hash
				&& images[src].hash !== images[src2].hash
				&& distance(images[src].hash, images[src2].hash) > threshold
			) {
				error(__filename, item, [src, src2, distance(images[src].hash, images[src2].hash)]);
			}
		});
	});
}

function distance(hashA, hashB) {
	let dist = 0;
	for (let i = 0; i < hashA.length; i++) {
		dist += Math.abs(parseInt(hashA[i], 36) - parseInt(hashB[i], 36));
	}
	return dist;
}
