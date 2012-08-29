var PluginLoader = require('../lib/plugin-loader');


var pl = new PluginLoader();
//pl.load('less');
//pl.list(function(err, data){
//
//   console.log('data',data);
//});
//
pl.list(function(){
    console.log('list', arguments);
});