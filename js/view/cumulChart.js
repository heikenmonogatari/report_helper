var CumulChartItemView = Backbone.Marionette.ItemView.extend({
	initialize: function() {
		this.fetchCumulData(); // graph of day containing all days
	},

	fetchCumulData: function() {
		var self = this;
		var dataCollection = new DataCollection();

		/*var currentDate = moment(this.model.get('date'));
		var currentDateClone = moment(currentDate);

		if (moment().diff(currentDateClone.add(3, 'M'), 'd') < 0) {
			console.log("hello");
			this.end = moment().endOf('day');
			var endClone = moment(this.end);
			this.begin = endClone.subtract(6, 'M').startOf('isoweek');
		}else{
			this.begin = currentDate.subtract(3, 'M').startOf('isoweek');
			var beginClone = moment(this.begin);			
			this.end = beginClone.add(6, 'M').endOf('isoweek');
		}

		console.log(this.begin.format('YYYYMMDD'));
		console.log(this.end.format('YYYYMMDD'));*/

		this.begin = moment($('#date_begin').val());
		this.end = moment($('#date_end').val());

		var nbWeek = this.end.diff(this.begin, 'weeks') + 1;

		dataCollection.url = "https://api.eco-counter-tools.com/v1/" + MyApp.apiKey + "/data/periode/" 
							+ this.model.get('id')
							+ '?begin=' + this.begin.format('YYYYMMDD')
							+ '&end=' + this.end.format('YYYYMMDD')
							+ '&step=' + 3;

		dataCollection.fetch({
			success: function() {
				self.serialize_week(dataCollection, nbWeek, this.begin, this.end);
			}
		});			
	},

	serialize_week: function(dataCollection, nbWeek, begin, end) {
		var series = [];
		for (var i=0; i<nbWeek; i++) {

			var weekSerie = {};
			var data = [];

			for (var j=0; j<168; j++) {
				var datum = dataCollection.at(j + i * 168);
				if (!datum) break;
				data.push(datum.get('comptage'));
			}
			weekSerie.data = data;
			weekSerie.name = moment(dataCollection.at(i*168).get('date')).format('YYYY-MM-DD');

			if (moment(dataCollection.at(i*168).get('date')) >= moment(this.model.get('date')).startOf('isoweek') && 
			 moment(dataCollection.at(i*168).get('date')) <= moment(this.model.get('date')).endOf('isoweek')) {
				weekSerie.lineWidth = 3;
			}else{
				weekSerie.lineWidth = 1;
			}

			weekSerie.pointInterval = 3600 * 1000;
			series.push(weekSerie);
		}
		console.log(series);

		this.makeCumulWeekChart(series);
	},

	makeCumulWeekChart: function(series) {
		var self = this;

		console.log(this.model.toJSON());
		$('#chart').highcharts({
			chart: {
				zoomType: 'xy'
			},
	        title: {
	            text: 'Something'
	        },
	        xAxis: {
	        	type: 'datetime',
	        	dateTimeLabelFormats: {
	        		day: '%H:%M'
	        	}
	        },
	        yAxis: {
	            title: {
	                text: 'Counts'
	            },
	            plotLines: [{
	                value: 0,
	                width: 1,
	                color: '#808080'
	            }]
	        },
	        tooltip: {
	            formatter: function () {
	                return this.series.name + " " + moment.utc(this.x).format('HH:mm') + ': ' + this.y
	            }
	        },
	        plotOptions: {
	            series: {
	                marker: {
	                    enabled: false
	                },
	                point: {
	                	events: {
	                		click: function() {
	                			var url = '#/id/' + self.model.get('id') 
										+ '/date/' + this.series.name
										+ '/step/' + 3
										+ '/period/' + 5;

								window.open(url, '_blank');
	                		}
	                	}
	                },
	                pointStart: Date.UTC(2012, 7, 14)
            	}
        	},
	        legend: {
	            layout: 'vertical',
	            align: 'right',
	            verticalAlign: 'middle',
	            borderWidth: 0
	        },
	        series: series,
	        navigation: {
	        	buttonOptions: {
	        		
	        	}
	        }
	    });
	}
});	