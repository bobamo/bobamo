var Plugin = require('../../lib/plugin-api'), util = require('util'), _u = require('underscore');

var GeneratorPlugin = function (options) {
    Plugin.apply(this, arguments);
    this.pluginUrl = this.baseUrl;
    this.styles = ['css/bootstrap.min.css', 'css/styles', 'js/libs/table/jquery.sorter.css', 'js/libs/backbone-forms/src/backbone-forms.css', 'js/libs/backbone-forms/test/lib/jquery-ui/flick/jquery-ui-1.8.14.custom.css', 'js/libs/jquery-miniColors/jquery.miniColors.css'];

}

util.inherits(GeneratorPlugin, Plugin);

module.exports = GeneratorPlugin;

GeneratorPlugin.prototype.filters = function (options) {
    var apiPath = this.options.apiUri || this.baseUrl + 'rest';
    this.app.get(this.baseUrl + '*', function (req, res, next) {
        var useAuth = req.isAuthenticated ? true : false;
        var locals = {
            'useAuthentication':useAuth,
            'isAuthenticated':useAuth ? req.isAuthenticated() : false,
            'api':apiPath,
            'baseUrl':this.baseUrl,
            'params':req.params,
            'query':req.query,
            'appModel':this.pluginManager.appModel,
            'pluginManager':this.pluginManager,
            'options':options
        };
        if (_u.isFunction(res.local)) {
            _u.each(locals, function (v, k) {
                res.local(k, v);
            })
        } else {
            _u.extend(res.locals, locals);
        }
        next();
    }.bind(this));
    /*
     <link href="css/bootstrap.min.css" rel="stylesheet">
     <link href="css/styles.css" rel="stylesheet">
     <link href="js/libs/table/jquery.sorter.css" rel="stylesheet">
     <link href="js/libs/backbone-forms/src/backbone-forms.css" rel="stylesheet">
     <link href="js/libs/backbone-forms/test/lib/jquery-ui/flick/jquery-ui-1.8.14.custom.css" rel="stylesheet">
     <link href="js/libs/jquery-miniColors/jquery.miniColors.css" rel="stylesheet">
     */

}
var extRe = /\.(js|html|css|htm)$/i;
GeneratorPlugin.prototype.routes = function (options) {
    var appModel = this.pluginManager.appModel;

    function makeOptions(req) {
        var type = req.params.type;
        var opts = {};
        if (type) {
            type = type.replace(extRe, '');
            opts.model = appModel.modelFor(type);
            opts.type = type;
            opts.view = req.params.view;
        }
        return opts;
    }


    var app = this.app;
    var base = this.baseUrl;
    var index = this.options.index || 'index.html';

    app.get(base + index, function (req, res, next) {


        this.local(res, 'styles', this.styles);
        console.log('styles generated');
        this.generate(res, 'index.html', makeOptions(req), next);
    }.bind(this))

    app.get(base, function (req, res, next) {
        res.redirect(this.baseUrl + (this.options.index || 'index.html'));
    }.bind(this));

    app.get(base + 'js/:super?/views/:type/finder/:view.:format', function (req, res, next) {
        this.generate(res, 'views/finder.' + req.params.format, makeOptions(req), next);
    }.bind(this));

    app.get(base + ':view', function (req, res, next) {
        this.generate(res, req.params.view, makeOptions(req), next);
    }.bind(this));
    app.get(base + 'js/:view', function (req, res, next) {
        this.generate(res, req.params.view, makeOptions(req), next);
    }.bind(this));
    app.get(base + 'js/:super?/views/:view', function (req, res, next) {
        this.generate(res, req.params.view, makeOptions(req), next);
    }.bind(this));

    app.get(base + 'js/:super?/views/:type/:view', function (req, res, next) {
        this.generate(res, 'views/' + req.params.view, makeOptions(req), next);
    }.bind(this));

    app.get(base + 'js/:super?/:view/:type.:format', function (req, res, next) {
        this.generate(res, req.params.view + '.' + req.params.format, makeOptions(req), next);
    }.bind(this));

    app.get(base + 'js/:super?/:view', function (req, res, next) {
        this.generate(res, req.params.view, makeOptions(req), next);

    }.bind(this));
    app.get(base + 'templates/:super?/:type/:view', function (req, res, next) {
        this.generate(res, 'templates/' + req.params.view, makeOptions(req), next);

    }.bind(this));
    app.get(base + 'tpl/:super?/:view', function (req, res, next) {
        this.generate(res, 'templates/' + req.params.view, makeOptions(req), next);

    }.bind(this));
}
