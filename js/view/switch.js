var SwitchItemView = Backbone.Marionette.ItemView.extend({
	template: "#switch_template",

	events: {
		"click #chartToggle" : "toggleChartView",
		"click #cumulChartToggle" : "toggleCumulChartView"
	},

	initialize: function(options) {
		this.chartView = options.view;
		console.log('switch');
	},

	toggleChartView: function() {
		MyApp.trigger('showChart');
	},

	toggleCumulChartView: function() {
		MyApp.trigger('showCumulChart');
	},

	onShow: function() {
		$('.input-group.date.begin').datepicker({
		    format: "yyyy-mm-dd",
		    daysOfWeekDisabled: "0,2,3,4,5,6"
		});
		$('.input-group.date.end').datepicker({
		    format: "yyyy-mm-dd",
		    daysOfWeekDisabled: "1,2,3,4,5,6"
		});
	}
});