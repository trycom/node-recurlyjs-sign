var crypto = require('crypto')
  , uuid = require('node-uuid');

function recurly () {
}

recurly.prototype.sign = function (privateKey, params) {
  var protectedString = makeProtectedString(params);
  var secureHash = makeHash(privateKey, protectedString);
  var signature = secureHash+"|"+protectedString;
  console.log("Signature Created: "+signature);
  return signature;
}
 
function makeHash (privateKey, protectedString) {
  //get the sha1 of the private key in binary
  var shakey = crypto.createHash('sha1');
  shakey.update(privateKey);
  shakey = shakey.digest('binary');
  //now make an hmac and return it as hex
  var hmac = crypto.createHmac('sha1', shakey);
  hmac.update(protectedString);
  return hmac.digest('hex');
}
 
function makeProtectedString (params) {
  var protectedString = '';
 
  // These variables are used in every signature
  timestamp = Math.round(new Date().getTime() / 1000); //timestamp needs to be in seconds
  nonce = uuid.v1().replace(/-/g,''); //strip out dashed in case recurly doesnt like them?
  
  // Generate the URL fragment to be used
  protectedString += "nonce="+nonce+"&";
  for (var action in params) {
    for (var key in params[action]) {
      protectedString += action+'%5B'+key+'%5D='+params[action][key]+'&';
    }
  }
  protectedString += "timestamp="+timestamp;
  return protectedString;
}
 
module.exports = recurly;