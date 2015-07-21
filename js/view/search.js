var SearchView = Backbone.Marionette.ItemView.extend({
    template: "#search_template",

    events: {
        "click #search_button" : "showSearch",
        "keypress #search_input"   : "keyAction"
    },

    showSearch: function() {

        var query = $("#search_input").val();
        console.log("You have searched: " + query);

        var filtered = this.collection.byQuery(query);

        MyApp.trigger('search',filtered);
    },

    keyAction: function(e) {
        if (e.which == 13) {
            this.showSearch();
            event.preventDefault();
            return false;
        }
    }
});