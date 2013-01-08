var qs = require('qs');
var crypto = require('crypto');

exports.sign = function(params, recurlyPrivateKey) {
	
	var time = ~~(Date.now() / 1000);
	var obj = {};
	obj.nonce = crypto.createHash('sha1').update(time+Math.random()+'').digest('hex'); // Create a randomised, time-based one-use number
	
	this.concatParams(obj, params);

	obj.time = time;

	var protectedString = qs.stringify(obj);
	 
	// hmac hash with private key
	var hmac = crypto.createHmac('sha1', recurlyPrivateKey);
	hmac.update(protectedString);
	var signature = hmac.digest('hex');
	signature += "|"+protectedString;

	return signature;
};

var concatParams = function(obj, params) {
	var attr,
  __hasProp = {}.hasOwnProperty;

	for (attr in params) {
	  if (!__hasProp.call(params, attr)) continue;
	  obj[attr] = params[attr];
	}

}