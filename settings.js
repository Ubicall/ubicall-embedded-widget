var loader = require("node-remote-config-loader");
var log = require("./log");

process.env.node_env = process.env.node_env || "development";
process.env.config_version = process.env.config_version || 20150920;

var DEVENV = (process.env.node_env === "development" || process.env.node_env === "test");
if(DEVENV){
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
}


var config = loader.load({
  configHost: process.env.node_env === "production" ? "http://developer.ubicall.com/conf/" : "http://developer-dev.ubicall.com/conf/",
  configVersion: process.env.config_version,
  configEnv: process.env.node_env
});

var CDN_HOST = "https://cdn.ubicall.com";
var CDN_DEV_HOST = "https://cdn-dev.ubicall.com";
var THEME_LOCATION = "/static/ubicall/css/widget/themes/";

module.exports = {
  platformTemplatesPath: "/var/www/widget/li/",
  port: 7575,
  host: "127.0.0.1",
  mainTemplate: DEVENV ? "./views/dev/template.html" : "./views/template.html",
  mainTemplate_popUp: DEVENV ? "./views/dev/widget.html" : "./views/widget.html",
  iframe_popUp: DEVENV ? "https://platform-dev.ubicall.com/widget/li/" : "https://platform.ubicall.com/widget/li/",
  plistHost: DEVENV ? config.endPoints.dev.defaultPlistHost : config.endPoints.defaultPlistHost,
  themeHost: DEVENV? (CDN_DEV_HOST + THEME_LOCATION) : (CDN_HOST + THEME_LOCATION)
};
