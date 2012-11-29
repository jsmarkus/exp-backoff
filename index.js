/**
* @param {Function} func
* @param {Object} options
* options.delay = 100 - delay before firsty retry
* options.factor = 2 - delay multiplier
* options.maxDelay - maximum delay
* options.retryLimit - number of retries to fail after
* options.timeout - timeout
*/
function expBackoff(func, options) {
    options = options || {};
    var   delay    = (undefined === options.delay) ?
                        100 : options.delay
        , factor   = (undefined === options.factor) ?
                        2   : options.factor
        , maxDelay = (undefined === options.maxDelay) ?
                        false : options.maxDelay
        , retryLimit = (undefined === options.retryLimit) ?
                        false : options.retryLimit
        , currentDelay = delay
        , timeout = (undefined === options.timeout) ?
                        false : options.timeout
        , onRetry = options.onRetry
        , totalTime = currentDelay
        , retryCount = 1
        , next
    ;


    next = function () {
        var oldArguments = arguments
            , funcLength = arguments.length
            , callback = arguments[funcLength-1]
            , argsWithoutCallback = Array.prototype.slice.call(
                    arguments, 0, funcLength - 1)
            , newArguments
            , context = this
            , retry
            , newCallback
        ;

        retry = function () {
            if ('function' === typeof onRetry) {
                onRetry.call(context, {
                    currentDelay : currentDelay,
                    retryCount : retryCount
                });
            }

            setTimeout(function () {
                next.apply(context, oldArguments);
            }, currentDelay);

            currentDelay *= factor;

            if(false !== maxDelay && currentDelay > maxDelay) {
                currentDelay = maxDelay;
            }

            totalTime += currentDelay;
            retryCount++;
        };

        newCallback = function (err) {
            if(err) {
                if(false !== retryLimit &&
                    retryLimit > 0 &&
                    retryCount >= retryLimit) {
                    callback(err);
                } else if(false !== timeout && timeout > 0 &&
                    totalTime > timeout) {
                    callback(err);
                } else {
                    retry();
                }
            } else {
                callback.apply(null, arguments);
            }
        };

        newArguments = argsWithoutCallback.concat([newCallback]);

        func.apply(context, newArguments);
    };
    return next;
}

module.exports = expBackoff;