/*global phantom: false*/

var page = require('webpage').create();
var system = require('system');

if (system.args.length !== 2) {
	console.error('Missing argument');
	phantom.exit(1);
}

var config = JSON.parse(system.args[1]);

page.onCallback = function(data) {
	console.log(JSON.stringify(data));
	phantom.exit();
};

// @TODO this isn’t working currently, so errors in script.js get ignored
page.onError = function(msg) {
	console.log('ERROR: ' + msg);
	phantom.exit(1);
};

page.open(config.url, function(status) {

	if (status !== 'success') {
		console.error(status);
		phantom.exit(1);
		return;
	}

	page.includeJs('script.js');

	setTimeout(function() {
		console.error('20sec timeout reached before the tests complete.');
		phantom.exit(1);
	}, 20000);

});
