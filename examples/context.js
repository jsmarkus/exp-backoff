var expBackoff = require('../');

var obj = {
	prop : 'foo',
	counter : 0,
	func : function (cb) {
		if(this.counter++ >= 10) {
			cb(null, this.prop);
		} else {
			cb('error');
		}
	}
}

expBackoff(obj.func, {delay:100, maxDelay:500}).call(obj, function(err, res) {
	console.log(err, res);
});