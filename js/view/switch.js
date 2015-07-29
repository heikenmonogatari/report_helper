var SwitchItemView = Backbone.Marionette.ItemView.extend({
	template: "#switch_template",

	events: {
		"click #chartToggle" : "toggleChartView",
		"click #cumulChartToggle" : "toggleCumulChartView"
	},

	initialize: function(options) {
		this.chartView = options.view;
	},

	toggleChartView: function() {
		MyApp.trigger('showChart');
	},

	toggleCumulChartView: function() {
		MyApp.trigger('showCumulChart');
	}
});