var expBackoff = require('../')
, nthSuccess = require('./helper').nthSuccess
;

var nthSuccessRetry = expBackoff(nthSuccess(5), {
	delay  : 100,
	//timeout  : 150,
	//retryLimit : 2,
	factor : 2
});

nthSuccessRetry(function (err) {
	if(err) {
		console.log('Error:', arguments);
	} else {
		console.log('Success:', arguments);
	}
});
