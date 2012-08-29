define(['underscore', 'Backbone', 'libs/bobamo/list', 'plugin/admin/model', 'text!${pluginUrl}/templates/admin/table.html',
    'text!${pluginUrl}/templates/admin/table-item.html'], function (_, Backbone, ListView, model, tableTemplate, listItemTemplate) {



    return ListView.extend({
        template:_.template(tableTemplate),
        listItemTemplate:_.template(listItemTemplate),
        collection:new model.Collection(),
        model:model.Model,
        config:{
            title:'Plugins',
            modelName:'plugin',
            plural:'Plugins'
        }

    })
})
;