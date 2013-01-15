var expBackoff = require('../')
    , critical = require('./helper').critical
;

// This example shows how retry procedure may be broken by returning false from onRetry.
// This feature may be used, for example,
// if you decide that the error is unrecoverable
// and retrying is not needed.


var onRetry = function (options) {
	if(options.lastError === 'critical') {
		return false;
	}
	console.log('Retrying in ',options.currentDelay,'ms. ',
		'Tried ',options.retryCount,'times');
};

var nthSuccessRetry = expBackoff(critical, {
	delay  : 100,
	maxDelay : 2000,
	factor : 2,
	onRetry : onRetry
});

nthSuccessRetry(function (err) {
	if(err) {
		console.log('Error:', arguments);
	} else {
		console.log('Success:', arguments);
	}
});
