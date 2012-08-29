var npm = require("npm"), request = require('request'), _u = require('underscore');

var PluginLoader = function (opts) {
    opts = opts || {};
    this.pluginUrl = 'https://raw.github.com/bobamo/plugins/master/.gitmodules';

    if (process.env['http_proxy']) {
        opts.proxy = process.env['http_proxy'];
    }
    this.request = request.defaults(opts)
}

PluginLoader.prototype.npmInstall = function (libs, callback) {
    npm.load({}, function (er) {
        if (er) return callback(er);
        npm.commands.install(libs, function (er, data) {
            if (er) throw new Error(er);
            callback(er, data);
        });
    });

}

function filterDot(v,k){
    return !/^\./.test(v.name);
}
function getPackage(req, arr, cb, data){
      data = data || {};
      var name = arr.pop();
      var url = data[name].url.replace('https://github.com/', 'https://raw.github.com/')+'/master/package.json';
     //https://raw.github.com/bobamo/plugin-imageupload/master/package.json
      req.request.get(url, function(err, resp, body){
          try {
          data[name].package = JSON.parse(body);
          }catch(e){
              console.log('error parsing', body);
          }
          if (arr.length){
             getPackage(req,arr,cb, data);
         }else
            cb(null, data);

      } );
}
PluginLoader.prototype.list = function (cb) {
    this.request.get(this.pluginUrl, function (err, resp, body) {
        var modules = this.parseGitSubmodule(body);
        getPackage(this, _u.keys(modules), cb, modules);

    }.bind(this));
}

PluginLoader.prototype.load = function (plugin, version, cb) {
    console.log('load', plugin);
    version = version || 'master';
    this.npmInstall(['https://github.com/bobamo/plugin-' + plugin + '/tarball/' + version], cb);


}
PluginLoader.prototype.checkInstalledVersion = function(plugin, callback){

}
var re =  /\[submodule "(.*)"\]\n\s*path\s=\s(.*)\n\s*url\s=\s(.*)\n/gm;
PluginLoader.prototype.parseGitSubmodule = function(str){


    var m = null;
    var data = {}
    while(m = re.exec(str)){
        data[m[1]] = {url:m[3], name:m[1]};
    }
    return data;

}
module.exports = PluginLoader;