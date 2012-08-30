define(['Backbone', 'jquery', 'underscore', 'plugin/admin/model', 'text!${pluginUrl}/templates/admin/uninstall.html'], function (Backbone, $, _, model, template) {
    var view = Backbone.View.extend({
        template:_.template(template),
        modelType:model.Model,
        initialize:function () {
            _.bindAll(this);
        },
        events:{
            'click button.uninstall':'doUninstall'
        },
        doUninstall:function (e) {
            e.preventDefault();
            if (!this.model.get('installed')) {
                window.location.hash = '#/plugin/admin/list';

            } else {
                this.model.set('installed', false);
                $('.uninstall', this.$el).html('Uninstalling...').addClass('disabled');

                this.model.destroy({ success:this.onUninstall});
            }
        },
        onError:function () {
            console.log('error ', arguments);
        },
        onUninstall:function (e) {
            $('.error-list').empty().hide();
            $('.success-list').empty().hide();
            $('.uninstall', this.$el).html('Done').removeClass('disabled');
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