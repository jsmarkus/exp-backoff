var expBackoff = require('../')
    , nthSuccess = require('./helper').nthSuccess
;

var onRetry = function (options) {
	console.log('Retrying in ',options.currentDelay,'ms. ',
		'Tried ',options.retryCount,'times');
};

var nthSuccessRetry = expBackoff(nthSuccess(10), {
	delay  : 100,
	// timeout  : 150,
	//retryLimit : 2,
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
