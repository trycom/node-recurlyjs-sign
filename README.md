# Sign Recurly.js forms from nodejs!
---
##### Written by @arush (http://getbrandid.com) with help from @simon_tabor (http://GoSquared.com)
---
We looked high and low for a nodejs library to sign Recurly.js forms. After some solid google action, we even asked our #seedcamp compadres and fellow Recurlyists <http://github.com/SocialBro> and our nodejs neighbours <http://github.com/gosquared>, and we concluded that it didn't yet exist. So we wrote one.

## Installation
#### Include in package.json
This is the safest way to link to github instead for modules, and npm knows what to do with tarballs

    ...
    dependencies {
      "node-recurlyjs-sign": "https://github.com/brandid/node-recurlyjs-sign/tarball/master"
    }

#### Use the same config file from the node-recurly module
Everyone using this probably already uses the node-recurly module, so we made it easy to have both installed.

###### Just make sure you have PRIVATE_KEY in your config

    module.exports = {
      ...
      PRIVATE_KEY:  '<your private key, do not share this EVER>',
      ...
    };

For those of you that are  looking for a fork of the original node-recurly module that actually works, look no further than: <http://github.com/socialbro/node-recurly>

## Usage
###### Require it
    var recurlyjs = require("node-recurlyjs-sign");

then when you want to use it

###### Use different configs depending on environment
    if(process.env.NODE_ENV === "production") {
      var recurlyKeys = require('./recurly-prod-config');
    else {
      var recurlyKeys = require('./recurly-dev-config');
    }

###### Generate signature
    var signature = recurlyjs.sign(params, recurlyKeys.PRIVATE_KEY);


## Params recursively get parsed into a signable object
You know that feeling when you just wrote a recursive function and you want to tell everyone about it? This is that.

All you have to do is pass the required parameter object as stated in the Recurly.js docs, and the module will automatically flatten it into the proper signable object

###### one-off transaction example - required params
    var params = {
      "transaction": {
        "amount_in_cents":1999,
        "currency":"GBP"
      }
    }