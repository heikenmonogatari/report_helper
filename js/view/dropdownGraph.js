// DROPDOWNDATE ITEMVIEW
var DropDownDateView = Backbone.Marionette.ItemView.extend({
	template: "#dropdownDate_template",

	initialize: function(options) {
		this.myModel = options.myModel;
	},

	events: {
		"change #dropdownDate_selector": "changeDate"
	},

	changeDate: function() {
		console.log("Period changed...");

		this.myModel.set({period: $("#dropdownDate_selector").val()})

		if ($("#dropdownDate_selector").val() == 0 && $("#date_Start").val()) {
			this.myModel.set({begin: moment($("#date_Start").val()).startOf('day').format('YYYY-MM-DD')});
			this.myModel.set({end: moment($("#date_End").val()).endOf('day').format('YYYY-MM-DD')});
		} else if ($("#dropdownDate_selector").val() == 0) {
			this.myModel.set({begin: moment().subtract(1, 'M').startOf('day').format('YYYY-MM-DD')});
			this.myModel.set({end: moment().endOf('day').format('YYYY-MM-DD')});
		} else if ($("#dropdownDate_selector").val() == 2) {
			this.myModel.set({begin: moment().subtract(1, 'week').startOf('day').format('YYYY-MM-DD')});
			this.myModel.set({end:moment().endOf('day').format('YYYY-MM-DD')});
		} else if ($("#dropdownDate_selector").val() == 3) {
			this.myModel.set({begin: moment().subtract(1, 'week').startOf('week').add(1, 'd').format('YYYY-MM-DD')});
			this.myModel.set({end: moment().subtract(1, 'week').endOf('week').add(1, 'day').format('YYYY-MM-DD')});
		} else if ($("#dropdownDate_selector").val() == 4) {
			this.myModel.set({begin: moment().subtract(1, 'month').startOf('day').format('YYYY-MM-DD')});
			this.myModel.set({end: moment().endOf('day').format('YYYY-MM-DD')});
		} else if ($("#dropdownDate_selector").val() == 5) {
			this.myModel.set({begin: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')});
			this.myModel.set({end: moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')});
		} else if ($("#dropdownDate_selector").val() == 6) {
			this.myModel.set({begin: moment().subtract(3, 'month').startOf('day').format('YYYY-MM-DD')});
			this.myModel.set({end: moment().endOf('day').format('YYYY-MM-DD')});
		} else if ($("#dropdownDate_selector").val() == 7) {
			this.myModel.set({begin: moment().subtract(4, 'month').startOf('month').format('YYYY-MM-DD')});
			this.myModel.set({end: moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')});
		}
	}
});
