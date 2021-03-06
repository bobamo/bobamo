define(['Backbone', 'jquery', 'underscore', 'plugin/admin/model', 'text!${pluginUrl}/templates/admin/install.html'], function (Backbone, $, _, model, template) {
    var view = Backbone.View.extend({
        template:_.template(template),
        modelType:model.Model,
        initialize:function () {
            _.bindAll(this);
        },
        events:{
            'click button.install':'doInstall'
        },
        doInstall:function () {
            if (this.model.get('installed')) {
               window.location.hash = '#/plugin/admin/list';

            } else {
                $('.install', this.$el).html('Installing...').addClass('disabled');
                this.model.save('installed',true, {success:this.onSave, error:this.onError});
            }
        },
        onError:function () {
            console.log('error ', arguments);
        },
        onSave:function (e) {
            $('.error-list').empty().hide();
            $('.success-list').empty().hide();
            $('.install', this.$el).removeClass('disabled').html('Done');
        },

        render:function (obj) {
            console.log(arguments);
            var $el = this.$el;
            var self = this;
            this.model = new this.modelType(obj);
            console.log('url', this.model.url());
            this.model.fetch({success:function () {

                $el.html(self.template({item:self.model }, {}));
                $(self.options.container).empty().append($el);
            }});
            return this;
        }

    });

    return view;
});