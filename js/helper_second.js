MyApp.module('SecondPage', function (SecondPage, MyApp, Backbone, Marionette, $, _){

	SecondPage.Controller = Marionette.Controller.extend({
		start: function(info) {
			console.log("SecondPage Controller start...");

			SecondPage.root = new MyApp.Layout.Root();

			// info de l'URL
			this.id = info[0];
			this.date = info[1];
			this.step = info[2];
			this.period = info[3];
			this.hour = 'NaN';

			if (info[4]) this.hour = info[4];

    		var self = this;

    		this.myModel = new MyModel({
    			date: this.date, 
				begin: this.begin, 
				end: this.end, 
				step: this.step, 
				period: this.period, 
				hour: this.hour,
				view: 0
			});

    		this.myModel.url = "https://api.eco-counter-tools.com/v1/" + MyApp.apiKey + "/counting_site/" + this.id;

    		this.myModel.fetch({
    			success: function() {
    				document.title = self.myModel.get('name');
					self.showChart();
		    		self.showNavigation();
		    		self.showInfo();
		    		self.showOptions();
		    		self.showPictures(); 				
    			}
    		});
		},

		showChart: function() {
			console.log("Displaying chart...");
			var chartItemView = new ChartItemView({model: this.myModel});

			if (!chartItemView) {
				var chartItemView = "";
			}

			var currentDate = moment(this.date);
			var currentDateClone = moment(currentDate);

			if (moment().diff(currentDateClone.add(3, 'M'), 'd') < 0) {
				console.log("hello");
				var end = moment().endOf('day');
				var endClone = moment(end);
				var begin = endClone.subtract(6, 'M').startOf('isoweek');
			}else{
				var begin = currentDate.subtract(3, 'M').startOf('isoweek');
				var beginClone = moment(begin);			
				var end = beginClone.add(6, 'M').endOf('isoweek');
			}

			var dateModel = new Backbone.Model({
				'begin': begin.format('YYYY-MM-DD'),
				'end': end.format('YYYY-MM-DD')
			});

			var switchItemView = new SwitchItemView({model: dateModel, view: chartItemView});
			SecondPage.root.showChildView('switchButton', switchItemView);	
		},

		showCumulChart: function() {
			console.log("Displaying chart with multiple weeks...");
			var cumulChart = new CumulChartItemView({model: this.myModel});
		},

		showNavigation: function() {
			console.log("Displaying navigation menu...");
			var navigationItemView = new NavigationItemView({model: this.myModel, date: this.date});
			SecondPage.root.showChildView('navigation2', navigationItemView);			
		},

		showInfo: function() {
			console.log("Displaying info box...");
			var infoView = new InfoItemView({model: this.myModel});
			SecondPage.root.showChildView('info2', infoView);
		},

		showOptions: function() {
			console.log("Displaying options...");
			var optionsView = new OptionsItemView({model: this.myModel});
			SecondPage.root.showChildView('option', optionsView);	
		},

		showPictures: function() {
			console.log("Displaying pictures if available...");

			var data = [];
			this.myModel.get('photo').forEach(function(picture) {
				data.push({photo: picture});
			});

			var photos = new PhotoCollection(data);
			var photoView = new PhotoCollectionView({collection: photos});
			SecondPage.root.showChildView('photo', photoView);	
		},

		showStats: function(options) {
			var statsCollectionView = new StatsCollectionView({collection: options[0], template: options[1]});
			SecondPage.root.showChildView('stats', statsCollectionView);		
		}
	});

	SecondPage.on('startSecond', function(options) {
		SecondPage.controller = new SecondPage.Controller();	
		SecondPage.controller.start(options);
	});

	SecondPage.on('refreshGraphs', function(options) {	
		SecondPage.controller = new SecondPage.Controller();
		SecondPage.controller.start(options);
	});

	MyApp.on('displayStats', function(options){
		SecondPage.controller.showStats(options);
    });

    MyApp.on('showCumulChart', function() {
    	SecondPage.controller.showCumulChart();
    });

    MyApp.on('showChart', function() {
    	SecondPage.controller.showChart();
    });
});
