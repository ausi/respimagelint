import roundWidth from '../../src/util/roundWidth';

test('Does not round under 100', () => {
	expect(roundWidth(0)).toBe(0);
	expect(roundWidth(1)).toBe(1);
	expect(roundWidth(2)).toBe(2);
	expect(roundWidth(6)).toBe(6);
	expect(roundWidth(51)).toBe(51);
	expect(roundWidth(99)).toBe(99);
});

test('Rounds to the next multiple of 5 under 500', () => {
	expect(roundWidth(101)).toBe(100);
	expect(roundWidth(102)).toBe(100);
	expect(roundWidth(103)).toBe(105);
	expect(roundWidth(104)).toBe(105);
	expect(roundWidth(105)).toBe(105);
	expect(roundWidth(497)).toBe(495);
	expect(roundWidth(499)).toBe(500);
	expect(roundWidth(500)).toBe(500);
});

test('Rounds to the next multiple of 10 over 500', () => {
	expect(roundWidth(500)).toBe(500);
	expect(roundWidth(500)).toBe(500);
	expect(roundWidth(503)).toBe(500);
	expect(roundWidth(504)).toBe(500);
	expect(roundWidth(505)).toBe(510);
	expect(roundWidth(1230)).toBe(1230);
	expect(roundWidth(1234)).toBe(1230);
	expect(roundWidth(1235)).toBe(1240);
	expect(roundWidth(1240)).toBe(1240);
});

test('Rounds to the next power of two', () => {
	expect(roundWidth(126)).toBe(125);
	expect(roundWidth(127)).toBe(128);
	expect(roundWidth(128)).toBe(128);
	expect(roundWidth(129)).toBe(130);
	expect(roundWidth(255)).toBe(255);
	expect(roundWidth(256)).toBe(256);
	expect(roundWidth(257)).toBe(256);
	expect(roundWidth(258)).toBe(260);
	expect(roundWidth(511)).toBe(510);
	expect(roundWidth(512)).toBe(512);
	expect(roundWidth(513)).toBe(512);
	expect(roundWidth(514)).toBe(512);
	expect(roundWidth(515)).toBe(512);
	expect(roundWidth(516)).toBe(520);
	expect(roundWidth(1022)).toBe(1020);
	expect(roundWidth(1023)).toBe(1024);
	expect(roundWidth(1024)).toBe(1024);
	expect(roundWidth(1025)).toBe(1024);
	expect(roundWidth(1026)).toBe(1024);
	expect(roundWidth(1027)).toBe(1030);
});
