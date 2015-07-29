MyApp.module('Layout', function (Layout, MyApp, Backbone) {

    Layout.Root = Backbone.Marionette.LayoutView.extend({
        el: 'body',
        regions: {
            search: '#search',
            info: '#info',
            main: '#main',    
            counters: '#counters',
            navigation: '#navigation',
            buttons: '#parameter',
            submit: '#submit',
            date: '#date',
            dropdown: '#dropdown',
            legend: '#legend',
            option: '#options',
            info2: '#info2',
            stats: '#stats',
            chart: '#chart',
            photo: '#photos',
            map: '#map',
            navigation2: '#navigation2',
            switchButton: '#switchButton' 
        }
    });
});


