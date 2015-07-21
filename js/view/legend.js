// LEGEND ITEMVIEW
LegendItemView = Backbone.Marionette.ItemView.extend({

	template: "#legend_template",

	modelEvents: {
			'change:percentileFactor' : "modelChanged",
			'change:sdFactor' : "modelChanged",
			'change:percentile' : "modelChanged"
	},

	initialize: function() {
		//Backbone.globalEvent.on("factorChange", _.bind(this.render, this));
	},

	modelChanged: function() {
		this.render();
	}
});
