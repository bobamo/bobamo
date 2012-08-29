define(['Backbone'], function (Backbone) {
    var Model = Backbone.Model.extend({
        urlRoot:'${pluginUrl}/rest',
        schema:{
            url:{
                type:'String'
            },
            name:{
                type:'String'
            },
            package:{
                type:'Object',
                subObject:{
                    name:{
                        type:'String'
                    },
                    description:{
                        type:'String'
                    },
                    version:{
                        type:'String'
                    },
                    dependencies:{
                        type:'List',
                        listType:'Object',
                        subObject:{
                            name:{type:String},
                            version:{type:String}
                        }
                    }
                }
            },
            hidden:{
                type:'Checkbox'
            }
        },
        idAttribute:'name',
        // defaults:defaults,
        initialize:function () {
        },
//        parse:function(resp){
//            return resp.payload;
//        },
        parse:function(obj){
          return obj.payload || obj;
        },
        get:function (key) {
            if (key && key.indexOf('.') > -1) {
                var split = key.split('.');
                var val = this.attributes;
                while (split.length && val)
                    val = val[split.shift()];

                return val;
            }
            return Backbone.Model.prototype.get.call(this, key);
        }

    });

    var Collection = Backbone.Collection.extend({
        model:Model,
        url:'${pluginUrl}/rest',
        parse:function (resp) {
            return resp.payload;
        },
        initialize:function () {
        }
    });
    return {
        Collection:Collection,
        Model:Model
    }
});