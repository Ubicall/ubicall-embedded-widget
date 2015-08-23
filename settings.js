var fs = require('fs');
var config = {};
var configFile = process.env.HOME + '/.conf/ubicall.js'
if( fs.existsSync(configFile) ){
    config = require(configFile);
} else {
  throw new Error(configFile + ' Not Found !!!')
}

module.exports = {
  platformTemplatesPath : '/var/www/widget/li/',
  port : 7575,
  host : '127.0.0.1',
  mainTemplate : './views/template.html',
  plistHost: config.defaultPlistHost,
  cdn : {
    widget : '/var/www/widget/'
  }

}
