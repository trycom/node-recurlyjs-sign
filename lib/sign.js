var qs = require('qs');
var crypto = require('crypto');

var sign = function(params, recurlyPrivateKey) {
	
	var timestamp = ~~(Date.now() / 1000);
	var obj = {};
	obj.nonce = crypto.createHash('sha1').update(timestamp+Math.random()+'').digest('hex'); // Create a randomised, time-based one-use number
	
	parseParams(obj, params, null);

	obj.timestamp = timestamp;

	var protectedString = qs.stringify(obj);
	 
	// hmac hash with private key
	var hmac = crypto.createHmac('sha1', recurlyPrivateKey);
	hmac.update(protectedString);
	var signature = hmac.digest('hex');
	signature += "|"+protectedString;

	return signature;
};


// recursive function to convert params into signable object
// 'parent_key' is required to tell whether to format the attibute key like so: parent_key[nested_key]

var parseParams = function(obj, params, parent_key) {
	
	// concat params
	var attr, value,
	__hasProp = {}.hasOwnProperty;

	for (attr in params) {
	  
	  if (!__hasProp.call(params, attr)) continue;
	  
	  value = params[attr];

	  if(typeof value !== 'object') {
	  	
	  	if(parent_key === null) {
	  		// now we check whether to format the attribute key 
		  	obj[attr] = params[attr];
	  	} else {
	  		var key = parent_key + '[' + attr + ']';
	  		obj[key] = params[attr];
	  	}

	  } else {
	  	// assume value is an object and recursion is required
  		// hold on to your hats, we're goin in
	  	parseParams(obj, value, attr);
	  };
	
	}; // end for-in

};

exports.sign = sign;
