// STATS ITEMVIEW
StatsItemView = Backbone.Marionette.ItemView.extend({
	className: "stats_model",

	initialize: function(options) {
		this.template = options.template;
	}
});

// STATS COLLECTIONVIEW
StatsCollectionView = Backbone.Marionette.CollectionView.extend({
    childView: StatsItemView,

    initialize: function(options) {
    	this.template = options.template;
    },

    childViewOptions: function() {
    	var template = this.template;
    	return {
    		template: template
    	}
    }
});
