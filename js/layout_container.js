MyApp.module('ContainerLayout', function (ContainerLayout, MyApp, Backbone) {

    ContainerLayout.Root = Backbone.Marionette.LayoutView.extend({
        el: '#main',
        regions: {
            counterTable: '#table'
        }
    });
});

