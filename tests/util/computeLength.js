import computeLength from '../../src/util/computeLength';

test('Basic px value', () => {
	expect(computeLength('123px', 1024)).toStrictEqual(123);
});

test('Em values', () => {
	expect(computeLength('10em', 1024)).toStrictEqual(160);
	expect(computeLength('1.25em', 1024)).toStrictEqual(20);
});

test('Rem values', () => {
	expect(computeLength('10rem', 1024)).toStrictEqual(160);
	expect(computeLength('1.25rem', 1024)).toStrictEqual(20);
});
