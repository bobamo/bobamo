var PluginApi = require('../../lib/plugin-api'), _u = require('underscore'), PluginLoader = require('./plugin-loader');
var PluginPlugin = function (options, app, name) {
    PluginApi.apply(this, arguments);
    this.pluginLoader = new PluginLoader();
    this._payload = {};
    this._cached = false;
    this.config = {plugins:[]};
}
require('util').inherits(PluginPlugin, PluginApi);
PluginPlugin.prototype.admin = function () {
    return {
        href:'#/plugin/admin/list',
        title:'Plugins'
    };
}
PluginPlugin.prototype.allPlugins = function (callback) {
    if (!this._cached)
        this.pluginLoader.list(function (err, payload) {
            if (err) return callback(err);
            _u.each(payload, function (v, k) {
                var package = v.package
                var arr = [];
                if (package) {
                    _u.each(package.dependencies, function (k, v) {
                        arr.push({name:v, version:k})
                    });
                    package.dependencies = arr;
                }
            });
            this._payload = payload;
            this._cached = true;
            callback(null, payload);
        });
    else
        callback(null, this._payload);
};

PluginPlugin.prototype.routes = function (app) {

    this.app.get(this.pluginUrl + '/rest', function (req, res, next) {
        this.allPlugins(function (err, obj) {
            if (err) return next(err);
            res.send({status:0, payload:_u.values(obj)});
        })
    }.bind(this));

    this.app.get(this.pluginUrl + '/rest/:id', function (req, res, next) {
        this.allPlugins(function (err, obj) {
            if (err) return next(err);
            var id = req.params.id;
            var ret = _u.find(obj, function(v){return v.realName == id })
            res.send({status:0, payload:ret});
        });
    }.bind(this));

    this.app.del(this.pluginUrl + '/rest/:id?', function (req, res, next) {
        var name = req.body.name || req.params.id;
        this.pluginLoader.uninstall([name], function (err, resp) {
            if (err) return next(err);
            this._cached = false;
            this.config.plugins = _u.reject(this.config.plugins, function(v,k){
               return v.realName == name;
            });
            this.save(this.config, function(err, resp){
                res.send({
                    status:0
                });
            });
        }.bind(this));
    }.bind(this));

    this.app.put(this.pluginUrl + '/rest/:id?', function (req, res, next) {
        var name = req.body.name || req.params.id;
        this.pluginLoader.npmInstall([name], function (err, resp) {
            if (err) return next(err);
            this._cached = false;
            var obj = {plugins:[]};
            _u.each(this._payload, function (v, k) {
                if (v.installed) {
                    obj.plugins.push(k);
                }
            })
            this.save(obj, function (err, obj) {
                res.send({
                    status:0,
                    payload:this._payload[name]
                })
            }.bind(this), req);


        }.bind(this));

    }.bind(this));
    PluginApi.prototype.routes.apply(this, arguments);
}

module.exports = PluginPlugin;

