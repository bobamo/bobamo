var Plugin = require('../../lib/plugin-api'), util = require('util'), path = require('path'), static = require('connect/lib/middleware/static'), _u = require('underscore');
var StaticPlugin = function () {
    Plugin.apply(this, arguments);
}
util.inherits(StaticPlugin, Plugin);
StaticPlugin.prototype.editors = function () {
    return ['Text', 'Checkbox',
        'Checkboxes',
        'Date',
        'DateTime',
        'Hidden',
        'List',
        'NestedModel',
        'Number',
        'Object',
        'Password',
        'Radio',
        'Select',
        'TextArea', 'MultiEditor'];
}
StaticPlugin.prototype.filters = function () {
    var prefix = this.baseUrl;
    var sdir = path.join(this.path, 'public');
    var psdir = path.join(process.cwd(), 'public');

    var public = static(sdir);
    var publicUser = static(psdir);
    var libs = [{url:'bootstrap'}, {url:'backbone'}, {url:'backbone-forms', path:'backbone-forms/distribution'}];


    console.log("Public Dir: ", psdir, 'Plugin Dir', psdir);
    _u.each(libs, function(v){
        var bdir = path.join(path.dirname(module.filename), 'node_modules', v.path || v.url);

        var tpath = prefix+'js/libs/'+ v.url+'/*';
        console.log('mapping', bdir, 'to', tpath)
        this.app.get(tpath, function(req,res,next){
            req._url = req.url;
            req.url = req.url.substring(tpath.length -1);
            next();
        },  static(bdir), function (req, res, next) {
            req.url = req._url;
            next();
        });

    }, this);
    this.app.get(prefix + '*', function (req, res, next) {
        req._url = req.url;
        req.url = req.url.substring(prefix.length - 1);

        next();

    }, publicUser, public, function (req, res, next) {
        req.url = req._url;
        next();
    });

}
StaticPlugin.prototype.routes = function () {
}
module.exports = StaticPlugin;