// SEARCH ITEMVIEW
SearchItemView = Backbone.Marionette.ItemView.extend({
	template: "#searchList_template",
	tagName: 'tr',

	events: {
		'click .domain_link' : 'clickEvent'
	},

	clickEvent: function() {
		//MyApp.trigger('counterChosen', this.model);

		var domain = new Backbone.Model();

		domain.url = "https://api.eco-counter-tools.com/v1/" + MyApp.apiKey + "/domains/" + this.model.id;

		domain.fetch({
			success: function() {
				MyApp.trigger('counterChosen', domain);
			}
		});	
	}
});


// SEARCH COLLECTIONVIEW
SearchCollectionView = Backbone.Marionette.CollectionView.extend({
	childView: SearchItemView,
	tagName: 'table'
});