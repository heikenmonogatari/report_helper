// CHART ITEMVIEW
ChartItemView = Backbone.Marionette.ItemView.extend({

	initialize: function() {
		this.fetchData(); // graph of specified day
	},

	fetchData: function() {

		if (this.model.get('period') == 4) {
			this.model.set({'begin': moment(this.model.get('date')).startOf('day').format('YYYYMMDD')});
			this.model.set({'end': moment(this.model.get('date')).endOf('day').format('YYYYMMDD')});
		} else if (this.model.get('period') == 5) {
			this.model.set({'begin': moment(this.model.get('date')).startOf('week').add(1, 'day').format('YYYYMMDD')});
			this.model.set({'end': moment(this.model.get('date')).endOf('week').add(1, 'day').format('YYYYMMDD')});
			if (moment(this.model.get('date')).format('d') == 0) {
    			this.model.set({'begin': moment(this.model.get('date')).subtract(1, 'day').startOf('week').add(1, 'day').format('YYYYMMDD')});
				this.model.set({'end': moment(this.model.get('date')).endOf('day').format('YYYYMMDD')});
    		}
		} else if (this.model.get('period') == 6) {
			this.model.set({'begin': moment(this.model.get('date')).startOf('month').format('YYYYMMDD')});
			this.model.set({'end': moment(this.model.get('date')).endOf('month').format('YYYYMMDD')});
		}

		this.checkChannels();
	},

	checkChannels: function() {
		var channel = new ChannelCollection();

    	channel.url = "https://api.eco-counter-tools.com/v1/" + MyApp.apiKey + "/counting_site/channels/"
    						+ this.model.get('id');

    	var self = this;

    	channel.fetch({
    		success: function() {
    			if (channel.toJSON().length == 0) {
    				console.log("This counter has no channels");
    				self.noChannelFetch();
    			}else{
    				console.log("This counter has " + channel.length + " channels");
    				self.someChannelFetch(channel);
    			}
    		}
    	});
	},

	noChannelFetch: function() {

		var self = this;

		var data = new DataCollection();
		data.url = 'https://api.eco-counter-tools.com/v1/" + MyApp.apiKey + "/data/periode/' 
							+ this.model.get('id')
							+ '?begin=' + this.model.get('begin')
							+ '&end=' + this.model.get('end')
							+ '&step=' + this.model.get('step');

		data.fetch({
			success: function() {

				var dataJSON = data.toJSON();
				var currentData = [];

				for (var i=0; i<data.length; i++) {
					if (moment(data.at(i).get('date')).format('YYYY-MM-DD HH:mm') == self.model.get('date') + " " + self.model.get('hour')) {
						currentData.push({x: moment.utc( data.at(i).get('date'), "YYYY-MM-DD HH:mm:ss" ).unix() * 1000, y: data.at(i).get('comptage'), borderColor: 'red'});
					}else{
						currentData.push({x: moment.utc( data.at(i).get('date'), "YYYY-MM-DD HH:mm:ss" ).unix() * 1000, y: data.at(i).get('comptage')});
					}
				}
		
				self.makeChart(currentData, self.model.get('begin'), self.model.get('end'));
				var statsList = _.extend(self.getNoStats(data.toJSON(), ""), {name: self.model.get('name')});

				var statsCollection = new StatsCollection();
				statsCollection.add(statsList);

				var template = "#stats_template";
				MyApp.trigger('displayStats',[statsCollection, template]);
			}
		});
	},

	someChannelFetch: function(channels) {
		var self = this;
		this.step = this.model.get('step');
		var series = [];
		var pieSeries = [];
		var statSeries = [];
		this.someFetchHelper(channels, series, pieSeries, statSeries, self);
	},

	someFetchHelper: function(channels, series, pieSeries, statSeries, self) {
		var channel = channels.shift();

		if (channel) {

			var dataCollection = new DataCollection();

			dataCollection.url = "https://api.eco-counter-tools.com/v1/" + MyApp.apiKey + "/data/periode/" 
							+ channel.get("id")
							+ '?begin=' + self.model.get('begin')
							+ '&end=' + self.model.get('end')
							+ '&step=' + self.step;

			dataCollection.fetch({
				success: function() {
					var serie = {};
					var pieSerie = [];
					var statSerie = [];
					var currentData = [];
					var sum = 0;

					var name = channel.get('name');

					serie.name = name;
					pieSerie[0] = name;
					statSerie[0] = name;

					dataCollection.each(function(data) {
						if (moment(data.get('date')).format('YYYY-MM-DD HH:mm') == self.model.get('date') + " " + self.model.get('hour')) {
							currentData.push({x: moment.utc( data.get('date'), "YYYY-MM-DD HH:mm:ss" ).unix() * 1000, y: data.get('comptage'), borderColor: 'red'});
						}else{
							currentData.push({x: moment.utc( data.get('date'), "YYYY-MM-DD HH:mm:ss" ).unix() * 1000, y: data.get('comptage')});
						}
						sum += data.get('comptage');
					});

					serie.data = currentData;
					pieSerie[1] = sum;
					statSerie[1] = dataCollection.toJSON();

					var channelDir = [];
					channelDir.push(channel.get('userType'));
					channelDir.push(channel.get('sens'));
					statSerie[2] = channelDir;

					series.push(serie);
					pieSeries.push(pieSerie);
					statSeries.push(statSerie);

					self.someFetchHelper(channels, series, pieSeries, statSeries, self);
				}
			});
		}else{
			self.makeStack(series, self.model.get('begin'), self.model.get('end'));
			self.makePie(pieSeries, self.model.get('begin'), self.model.get('end'));
			self.getSomeStats(statSeries);
		}
	},

	makeChart: function(data, begin, end) {
		//var serialized_data = this.jsonToArray( data, 'date', 'comptage' );

		if (this.model.get('period') == 4) {
			var period = "Day";
		}else if (this.model.get('period') == 5) {
			var period = "Week";
		}else if (this.model.get('period') == 6) {
			var period = "Month";
		}

		if (this.model.get('step') == 2) {
			var step = "15 Minute";
		}else if (this.model.get('step') == 3) {
			var step = "Hourly";
		}else if (this.model.get('step') == 4) {
			var step = "Daily";
		}else if (this.model.get('step') == 5) {
			var step = "Weekly";
		}else if (this.model.get('step') == 6) {
			var step = "Monthly";
		}


		$('#chart').highcharts({
	        chart: {
	        	type: 'column',
	            zoomType: 'xy'
	        },
	        title: {
	            text: step + ' Data of the Selected ' + period
	        },
	        subtitle: {
	            text: begin + " to " + end
	        },
	        xAxis: {
	            type: 'datetime',
	            minRange: 24 * 3600000,
	            labels: {
			       enabled: false
			    },
			    minorTickLength: 0,
			    tickLength: 0
	        },
	        legend: {
	            enabled: false
	        },
	        plotOptions: {
	            area: {
	                fillColor: {
	                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
	                    stops: [
	                        [0, Highcharts.getOptions().colors[0]],
	                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
	                    ]
	                },
	                marker: {
	                    radius: 2
	                },
	                lineWidth: 1,
	                states: {
	                    hover: {
	                        lineWidth: 1
	                    }
	                },
	                threshold: null
	            },
	            series: {
	            	animation: false
	            }	         
	        },
	        series: [{
	            pointInterval: 24 * 3600 * 1000,
	            data: data
	        }]
	    });
	},

	/*jsonToArray: function( json, field1, field2 ) { 
		var res = [];
	    var a;
	    var timestamp, value;
		for ( i in json ) {
			timestamp 	= moment.utc( json[i][field1], "YYYY-MM-DD HH:mm" ).unix() * 1000;
			value 		= json[i][field2];
		    a 			= [ timestamp, value ];
		    res.push( a );
		}
		return res;
	},*/

	makeStack: function(series, begin, end) {

		console.log(series);

		if (this.model.get('period') == 4) {
			var period = "Day";
		}else if (this.model.get('period') == 5) {
			var period = "Week";
		}else if (this.model.get('period') == 6) {
			var period = "Month";
		}

		if (this.model.get('step') == 2) {
			var step = "15 Minute";
		}else if (this.model.get('step') == 3) {
			var step = "Hourly";
		}else if (this.model.get('step') == 4) {
			var step = "Daily";
		}else if (this.model.get('step') == 5) {
			var step = "Weekly";
		}else if (this.model.get('step') == 6) {
			var step = "Monthly";
		}

		$('#chart').highcharts({
	        chart: {
	            type: 'column',
	            zoomType: 'xy'
	        },
	        title: {
	            text: step + ' Data of the Selected ' + period
	        },
	        subtitle: {
	            text: begin + " to " + end
	        },
	        xAxis: {
	            type: 'datetime',
	            minRange: 24 * 3600000 
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: 'Total counts'
	            },
	            stackLabels: {
	                enabled: false,
	                style: {
	                    fontWeight: 'bold',
	                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
	                }
	            }
	        },
	        legend: {
	            align: 'right',
	            x: -30,
	            verticalAlign: 'top',
	            y: 25,
	            floating: true,
	            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
	            borderColor: '#CCC',
	            borderWidth: 1,
	            shadow: false
	        },
	        tooltip: {
	            formatter: function () {
	                return '<b>' + moment(this.x).utc().format("dddd, MMMM DD, HH:mm") + '</b><br/>' +
	                    this.series.name + ': ' + this.y + '<br/>' +
	                    'Total: ' + this.point.stackTotal;
	            }
	        },
	        plotOptions: {
	            column: {
	                stacking: 'normal',
	                dataLabels: {
	                    enabled: false,
	                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
	                    style: {
	                        textShadow: '0 0 3px black'
	                    },
	                }
	            },
	            series: {
	            	animation: false
	            }
	        },
	        series: series
    	});
	},

	makePie: function(pieSeries, begin, end) {

		$('#pie[class="well"').highcharts({
	        chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false
	        },
	        /*title: {
	            text: 'Bikes and Pedestrians Split'
	        },*/
	        title: {
	            text: ''
	        },
	        tooltip: {
	            pointFormat: '<b>{point.percentage:.1f}%</b>'
	        },
	        /*subtitle: {
	            text: begin + " to " + end
	        },*/
	        plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                    enabled: true,
	                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
	                    style: {
	                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                    }
	                },
	                showInLegend: true
	            }
	        },
	        series: [{
	            type: 'pie',
	            data: pieSeries
	        }]
    	});
	},

	getNoStats: function(data, name) {
		var avg = 0;
		var sum = 0;
		var max = 0;
		var length = data.length;

		data.forEach(function(x) {
			if (x.comptage) {
				sum += x.comptage;
				if (max < x.comptage) {
					max = x.comptage;
				}
			}else{
				length -= 1;
			}
		});

		avg = sum / data.length;

		var avgName = 'average' + name;
		var maxName = 'maximum' + name;

		var ret = {};

		ret[avgName] = avg.toFixed(2);
		ret[maxName] = max;

		return ret;
	},

	getSomeStats: function(data) {
		
		if (data.length == 2) {
			for (var i=0; i<data.length; i++) {

				console.log(data[i][2][0]);
				console.log(data[i][2][1]);

				if (i == 0) {
					var name = 'In';
					var inDir = this.getNoStats(data[i][1], name);
					var inDir = _.extend(inDir, {nameIn: data[i][0]});
				}else{
					var name = 'Out';
					var outDir = this.getNoStats(data[i][1], name);
					var outDir = _.extend(outDir, {nameOut: data[i][0]});
				}
			}

			var total= _.extend(this.getNoStats(data[0][1].concat(data[1][1]), ""), {name: "Total"});

			statsList = _.extend(inDir, outDir, total);

			var template = "#stats2_template";
			var statsCollection = new StatsCollection();
			statsCollection.add(statsList);
			MyApp.trigger('displayStats',[statsCollection, template]);

		} else if (data.length == 4) {
			for (var i=0; i<data.length; i++) {
				if (data[i][2][0] == 1 && data[i][2][1] == 1) {
					var pedInData = data[i][1];
					var statsPedIN = this.getNoStats(data[i][1], "In");
					var pedIn = _.extend(statsPedIN, {nameIn: "Ped IN"});
				}else if (data[i][2][0] == 1 && data[i][2][1] == 2) {
					var pedOutData = data[i][1];
					var statsPedOUT = this.getNoStats(data[i][1], "Out");
					var pedOut = _.extend(statsPedOUT, {nameOut: "Ped OUT"});
				}else if (data[i][2][0] == 2 && data[i][2][1] == 1) {
					var bikeInData = data[i][1];
					var statsBikeIN = this.getNoStats(data[i][1], "In");
					var bikeIn = _.extend(statsBikeIN, {nameIn: "Bike IN"});
				}else if (data[i][2][0] == 2 && data[i][2][1] == 2) {
					var bikeOutData = data[i][1];
					var statsBikeOUT = this.getNoStats(data[i][1], "Out");
					var bikeOut = _.extend(statsBikeOUT, {nameOut: "Bike OUT"});
				}
			}

			var ped = _.extend(this.getNoStats(pedInData.concat(pedOutData), ""), {name: "Ped Total"});
			var bike = _.extend(this.getNoStats(bikeInData.concat(bikeOutData), ""), {name: "Bike Total"});

			statsList = [_.extend(ped, pedIn, pedOut), _.extend(bike, bikeIn, bikeOut)];

			var template = "#stats2_template";
			var statsCollection = new StatsCollection();
			statsCollection.add(statsList);
			MyApp.trigger('displayStats',[statsCollection, template]);
		}
	}
});


//moment.utc( data.get('date'), "YYYY-MM-DD HH:mm:ss" ).unix() * 1000