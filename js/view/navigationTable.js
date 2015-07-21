// NAVIGATION ITEMVIEW
NavigationTableItemView = Backbone.Marionette.ItemView.extend({

	modelEvents: {
		'change attribute': 'render'
	},

	getTemplate: function() {
		if (this.model.get('period') == 2 || this.model.get('period') == 3) {
			return "#navigation_template_week";
		}else if(this.model.get('period') == 4 || this.model.get('period') == 5 || this.model.get('period') == 0) {
			return "#navigation_template_month";
		}else if(this.model.get('period') == 6 || this.model.get('period') == 7) {
			return "#navigation_template_3_month";
		}
	},

	events:{
		"click #next" : "clickNext",
		"click #previous" : "clickPrev"
	},

	clickNext: function() {
		if (this.model.get('period') == 2 || this.model.get('period') == 3) {
			this.model.set('end', moment(this.model.get('end')).add(1, 'week').format('YYYY-MM-DD'));
			this.model.set('begin', moment(this.model.get('begin')).add(1, 'week').format('YYYY-MM-DD'));
		}else if(this.model.get('period') == 4 || this.model.get('period') == 5 || this.model.get('period') == 0) {
			this.model.set('end', moment(this.model.get('end')).add(1, 'month').format('YYYY-MM-DD'));
			this.model.set('begin', moment(this.model.get('begin')).add(1, 'month').format('YYYY-MM-DD'));
		}else if(this.model.get('period') == 6 || this.model.get('period') == 7) {
			this.model.set('end', moment(this.model.get('end')).add(3, 'month').format('YYYY-MM-DD'));
			this.model.set('begin', moment(this.model.get('begin')).add(3, 'month').format('YYYY-MM-DD'));
		}

		MyApp.trigger("refreshTable", this.collection);
	},

	clickPrev: function() {
		if (this.model.get('period') == 2 || this.model.get('period') == 3) {
			this.model.set('end', moment(this.model.get('end')).subtract(1, 'week').format('YYYY-MM-DD'));
			this.model.set('begin', moment(this.model.get('begin')).subtract(1, 'week').format('YYYY-MM-DD'));
		}else if(this.model.get('period') == 4 || this.model.get('period') == 5 || this.model.get('period') == 0) {
			this.model.set('end', moment(this.model.get('end')).subtract(1, 'month').format('YYYY-MM-DD'));
			this.model.set('begin', moment(this.model.get('begin')).subtract(1, 'month').format('YYYY-MM-DD'));
		}else if(this.model.get('period') == 6 || this.model.get('period') == 7) {
			this.model.set('end', moment(this.model.get('end')).subtract(3, 'month').format('YYYY-MM-DD'));
			this.model.set('begin', moment(this.model.get('begin')).subtract(3, 'month').format('YYYY-MM-DD'));
		}

		MyApp.trigger("refreshTable", this.collection);
	}
});