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
			if (moment(this.model.get('begin')).format('D') == 1 && moment(this.model.get('end')).format('D') == 30) {
				this.model.set('end', moment(this.model.get('end')).add(1, 'month').add(1, 'day').format('YYYY-MM-DD'));
				this.model.set('begin', moment(this.model.get('begin')).add(1, 'month').format('YYYY-MM-DD'));
			}else if (moment(this.model.get('begin')).format('D') == 1 &&
			 (moment(this.model.get('end')).format('D') == 28 || moment(this.model.get('end')).format('D') == 29) &&
			 (moment(this.model.get('end')).format('M') == 2)) {
			 	this.model.set('end', moment(this.model.get('end')).add(1, 'month').endOf('month').format('YYYY-MM-DD'));
				this.model.set('begin', moment(this.model.get('begin')).add(1, 'month').format('YYYY-MM-DD'));
			}else{
				this.model.set('end', moment(this.model.get('end')).add(1, 'month').format('YYYY-MM-DD'));
				this.model.set('begin', moment(this.model.get('begin')).add(1, 'month').format('YYYY-MM-DD'));
			}
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
			if (moment(this.model.get('begin')).format('D') == 1 && moment(this.model.get('end')).format('D') == 30) {
				this.model.set('end', moment(this.model.get('end')).subtract(1, 'month').add(1, 'day').format('YYYY-MM-DD'));
				this.model.set('begin', moment(this.model.get('begin')).subtract(1, 'month').format('YYYY-MM-DD'));
			}else if (moment(this.model.get('begin')).format('D') == 1 &&
			 (moment(this.model.get('end')).format('D') == 28 || moment(this.model.get('end')).format('D') == 29) &&
			 (moment(this.model.get('end')).format('M') == 2)) {
			 	this.model.set('end', moment(this.model.get('end')).subtract(1, 'month').endOf('month').format('YYYY-MM-DD'));
				this.model.set('begin', moment(this.model.get('begin')).subtract(1, 'month').format('YYYY-MM-DD'));
			}else{
				this.model.set('end', moment(this.model.get('end')).subtract(1, 'month').format('YYYY-MM-DD'));
				this.model.set('begin', moment(this.model.get('begin')).subtract(1, 'month').format('YYYY-MM-DD'));
			}
		}else if(this.model.get('period') == 6 || this.model.get('period') == 7) {
			this.model.set('end', moment(this.model.get('end')).subtract(3, 'month').format('YYYY-MM-DD'));
			this.model.set('begin', moment(this.model.get('begin')).subtract(3, 'month').format('YYYY-MM-DD'));
		}

		MyApp.trigger("refreshTable", this.collection);
	}
});