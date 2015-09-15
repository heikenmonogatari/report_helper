var CumulHourlyChartItemView = Backbone.Marionette.ItemView.extend({
	initialize: function() {
		this.fetchCumulData(); // graph of week containing all days as hourly data
	},

	fetchCumulData: function() {
		var self = this;
		var dataCollection = new DataCollection();

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

	// Serialization is done by finding and separating each week, starting with a monday and ending with a sunday
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

			//weekSerie.pointInterval = 3600 * 1000;
			series.push(weekSerie);
		}

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
	            text: 'Multiple Weeks Chart'
	        },
	        xAxis: {
	        	categories: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
	        	"00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
	        	"00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
	        	"00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
	        	"00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
	        	"00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
	        	"00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
	        	/*type:'datetime',
	            tickInterval:3600 * 1000,
	            labels: {
	                formatter: function () {
	                    return Highcharts.dateFormat('%H', this.value);

	                },
	                style: {
	                    color: '#89A54E'
	                },
	            }*/
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
	                return "Week of: " + this.series.name + "<br>Day: " + moment(this.series.name).add(this.series.data.indexOf(this.point), 'h').format('YYYY-MM-DD') + " " + '<br>Hour: ' + this.x + '<br>Count: ' + this.y
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