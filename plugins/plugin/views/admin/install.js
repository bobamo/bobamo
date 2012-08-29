define(['Backbone','jquery', 'underscore', 'plugin/admin/model','text!${pluginUrl}/templates/admin/install.html'], function(Backbone, $, _, model, template){
    var view = Backbone.View.extend({
       template:_.template(template),
       modelType:model.Model,
       initialize:function(){
           _.bindAll(this);
       },
       events:{
           'click button.install':'doInstall'
       },
       doInstall:function(){
         this.model.set('installed', true);
         this.model.save();

       },
        onError:function(){
          console.log('error ', arguments);
        },
        onSave:function (e) {
            e.preventDefault();
            $('.error-list').empty().hide();
            $('.success-list').empty().hide();

            this.model.save(null, {success:this.onSaveSuccess, error:this.onError});
       },
       onSaveSuccess:function(){
        this.$el.html('<h4>Installed '+this.model.id+'</h4>');
       },
       render:function(obj){
          console.log(arguments);
           var $el =this.$el;
           var self =this;
           this.model = new this.modelType(obj);
           console.log('url', this.model.url());
           this.model.fetch({success:function(){

               $el.html(self.template({item:self.model }, {}));
               $(self.options.container).empty().append($el);
           }});
           return this;
       }

    });

    return view;
});