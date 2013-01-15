//creates async test function that fails untill called n times 
var nthSuccess = function (n) {
	return (function () {
		var t = 0;
		return function (cb) {
			if(++t >= n) {
				cb(null, 'ok');
			} else {
				cb('error');
			}
		}
	}());
};

var critical = function (cb) {
	cb('critical');
};

exports.nthSuccess = nthSuccess;
exports.critical = critical;