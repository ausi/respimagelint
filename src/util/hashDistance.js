export default function hashDistance(hashA, hashB) {

	if (hashA === hashB) {
		return 0;
	}

	let dist = 0;
	for (let i = 0; i < hashA.length; i++) {
		dist += Math.abs(parseInt(hashA[i], 16) - parseInt(hashB[i], 16));
	}

	return dist / hashA.length / 15;

}
