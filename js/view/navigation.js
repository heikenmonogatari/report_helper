// NAVIGATION ITEMVIEW
NavigationItemView = Backbone.Marionette.ItemView.extend({

	modelEvents: {
		'change attribute': 'render'
	},

	getTemplate: function() {
		if (this.model.get('period') == 4) {
			return "#navigation_template_day";
		}else if(this.model.get('period') == 5) {
			return "#navigation_template_week";
		}else if(this.model.get('period') == 6) {
			return "#navigation_template_month";
		}
	},

	events:{
		"click #next" : "clickNext",
		"click #previous" : "clickPrev"
	},

	initialize: function(options) {
		this.date = options.date;
	},

	clickNext: function() {
		if (this.model.get('period') == 4) {
			var date = this.model.get('date').split(" ");

			date = moment(date[0]);

			date.add(1, 'd');

			this.model.set({date: date.format("YYYY-MM-DD")});
			this.model.set({begin: date.format("YYYYMMDD")});
			this.model.set({end: date.format("YYYYMMDD")});

			var id = this.model.get('id');
			var date = this.model.get('date');
			var step = this.model.get('step');
			var period = this.model.get('period');

		}else if(this.model.get('period') == 5) {
			var date = this.model.get('date').split(" ");

			date = moment(date[0]);

			date.add(1, 'week');

			this.model.set({date: date.format("YYYY-MM-DD")});
			this.model.set({begin: date.startOf('week').add(1, 'day').format("YYYYMMDD")});
			this.model.set({end: date.endOf('week').add(1, 'day').format("YYYYMMDD")});

			var id = this.model.get('id');
			var date = this.model.get('date');
			var step = this.model.get('step');
			var period = this.model.get('period');

		}else if(this.model.get('period') == 6) {
			var date = this.model.get('date').split(" ");

			date = moment(date[0]);

			date.add(1, 'M');

			this.model.set({date: date.format("YYYY-MM-DD")});
			this.model.set({begin: date.startOf('month').format("YYYYMMDD")});
			this.model.set({end: date.endOf('month').format("YYYYMMDD")});

			var id = this.model.get('id');
			var date = this.model.get('date');
			var step = this.model.get('step');
			var period = this.model.get('period');
		}

		Backbone.history.navigate('id/' + id 
								+ '/date/' + date 
								+ '/step/' + step 
								+ '/period/' + period, {trigger: true});
	},

	clickPrev: function() {
		if (this.model.get('period') == 4) {
			var date = this.model.get('date').split(" ");

			date = moment(date[0]);

			date.subtract(1, 'd');

			this.model.set({date: date.format("YYYY-MM-DD")});
			this.model.set({begin: date.format("YYYYMMDD")});
			this.model.set({end: date.format("YYYYMMDD")});

			var id = this.model.get('id');
			var date = this.model.get('date');
			var step = this.model.get('step');
			var period = this.model.get('period');

		}else if(this.model.get('period') == 5) {
			var date = this.model.get('date').split(" ");

			date = moment(date[0]);

			date.subtract(7, 'd');

			this.model.set({date: date.format("YYYY-MM-DD")});
			this.model.set({begin: date.startOf('week').add(1, 'day').format("YYYYMMDD")});
			this.model.set({end: date.endOf('week').add(1, 'day').format("YYYYMMDD")});

			var id = this.model.get('id');
			var date = this.model.get('date');
			var step = this.model.get('step');
			var period = this.model.get('period');

		}else if(this.model.get('period') == 6) {
			var date = this.model.get('date').split(" ");

			date = moment(date[0]);

			date.subtract(1, 'M');

			this.model.set({date: date.format("YYYY-MM-DD")});
			this.model.set({begin: date.startOf('month').format("YYYYMMDD")});
			this.model.set({end: date.endOf('month').format("YYYYMMDD")});

			var id = this.model.get('id');
			var date = this.model.get('date');
			var step = this.model.get('step');
			var period = this.model.get('period');
		}

		Backbone.history.navigate('id/' + id 
								+ '/date/' + date 
								+ '/step/' + step 
								+ '/period/' + period, {trigger: true});
	}
});