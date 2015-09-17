var loader = require('node-remote-config-loader');
var log = require('./log');


process.env.node_env = process.env.node_env || 'development';

if (!process.env.config_version) {
  log.help("You should specify configuration version to use, see README for detail")
  throw new Error("Missed config_version environment variable");
}

var config = loader.load({
  configHost: process.env.node_env == "production" ? "http://developer.ubicall.com/conf/" : "http://developer.dev.ubicall.com/conf/",
  configVersion: process.env.config_version,
  configEnv: process.env.node_env
});



module.exports = {
  platformTemplatesPath: '/var/www/widget/li/',
  port: 7575,
  host: '127.0.0.1',
  mainTemplate: './views/template.html',
  plistHost: config.defaultPlistHost

}
