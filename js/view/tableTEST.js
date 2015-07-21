// TABLE ITEMVIEW
var TableItemViewTest = Backbone.Marionette.ItemView.extend({
	
	template: "#chart_container_template",

	initialize: function(options) {
		this.myModel = options.myModel;

		_.bindAll(this, 'scroll');
		$(window).scroll(this.scroll);

		$('#general_info').append("<div id='header'></div>");
	},

	onRender: function() {

		var collectionJSON = this.collection.toJSON();

		var ids = [];
		this.collection.forEach(function(counter) {
			ids.push(counter.get('id'));
		});


		// Create xAxis categories
		var names = [];
		this.collection.forEach(function(counter) {
			names.push(counter.get('name'));
		});
		// Create yAxis categories
		var dates = [];
		var currentDate = moment(this.myModel.get('begin')).format('YYYY-MM-DD HH:mm');
		var endDate = moment(this.myModel.get('end')).add(24, 'hour').format('YYYY-MM-DD HH:mm');

		while (currentDate != endDate) {
			dates.push(currentDate);
			currentDate = moment(currentDate).add(1, 'hour').format('YYYY-MM-DD HH:mm');
		}
		// Create data
		this.createData(ids, names, dates);
		this.makeHeader(names);

	},

	makeTable: function(names, dates, data){	

		//this.$('#chart_container').highcharts({
		var chart = new Highcharts.Chart({
	        chart: {
	            type: 'heatmap',
	            renderTo: chart_container
	        },
	        title: {
	            text: null
	        },
	        tooltip: {
	            formatter: function () {
	                return '<b>' + this.series.yAxis.categories[this.point.y] + ' </b> had a value of <br><b>' + this.point.value + '</b> on <b>' + this.series.xAxis.categories[this.point.x] + '</b>';
	            },
	            //backgroundColor: null,
	            borderWidth: 1,
	            borderColor: '#000000',
	            distance: 10,
	            shadow: false,
	            useHTML: true,
	            style: {
	                padding: 0,
	                color: 'black'
	            }
	        },
	        xAxis: {
	            categories: names,
	            opposite: true,
	            labels: {
	                rotation: 315
	            }
	        },
	        yAxis: {
	            title: {
	                text: null
	            },
	            labels: {
	                enabled: true
	            },
	            categories: dates,
	            min: 0,
	            reversed: true
	        },
	        plotOptions: {
	        	series: {
	                cursor: 'pointer',
	                point: {
	                    events: {
	                        click: function () {
	                            window.open(this.options.url, '_blank');
	                        }
	                    }
	                }
            	}
	        },
	        legend: {
	        	enabled: false
	        },
	        series: [{
	            borderWidth: 0,
	            data: data,
	            turboThreshold: 100000
	        }]
		});

		for (var i=0; i<dates.length; i++) {
			if (moment(dates[i]).format('HH:mm') == "23:00") {
				chart.yAxis[0].addPlotLine({
					value: i + 0.5,
		            color: 'green',
		            width: 2,
		            zIndex: 10
				});
			}
			if (moment(dates[i]).format('d') == 0 && (moment(dates[i]).format('HH:mm') == "23:00")) {
				chart.yAxis[0].addPlotLine({
					value: i + 0.5,
		            color: 'blue',
		            width: 2,
		            zIndex: 15
				});
			}
		}
	},

	createData: function(ids, names, dates){
		var self = this;
		var data = [];
		var column = 0;
		var data = this.createDataHelper(ids, column, data, names, dates, self);
	},

	createDataHelper: function(ids, column, data, names, dates, self) {

		var id = ids.shift();
		if (id) {
			var dataCollection = new DataCollection();

			dataCollection.url = 'https://api.eco-counter-tools.com/v1/h7q239dd/data/periode/' 
							+ id
							+ '?begin=' + moment(self.myModel.get('begin')).format('YYYYMMDD')
							+ '&end=' + moment(self.myModel.get('end')).format('YYYYMMDD')
							+ '&step=' + 3;

			dataCollection.fetch({
				success: function() {

					var limit = dataCollection.getLimit(dataCollection.toJSON());
	    			var interval = limit / 15;
	    			if (dataCollection.length != 0) {
						dataCollection.each(function(datum) {
							var row = dataCollection.indexOf(datum);
							var count = datum.get('comptage');

							if (datum.get('comptage') === null) {
		    					var color = "blue";
		    				}else if (datum.get('comptage') == 0) {
		    					var color = "#F9F9CB";
		    				}else if (datum.get('comptage') > 0 && datum.get('comptage') <= interval) {
		    					var color = "#FFFFFF";
		    				}else if (datum.get('comptage') > interval && datum.get('comptage') <= interval * 2) {
		    					var color = "#EEEEEE";
		    				}else if (datum.get('comptage') > interval * 2 && datum.get('comptage') <= interval * 3) {
		    					var color = "#DDDDDD";
		    				}else if (datum.get('comptage') > interval * 3 && datum.get('comptage') <= interval * 4) {
		    					var color = "#CCCCCC";
		    				}else if (datum.get('comptage') > interval * 4 && datum.get('comptage') <= interval * 5) {
		    					var color = "#BBBBBB";
		    				}else if (datum.get('comptage') > interval * 5 && datum.get('comptage') <= interval * 6) {
		    					var color = "#AAAAAA";
		    				}else if (datum.get('comptage') > interval * 6 && datum.get('comptage') <= interval * 7) {
		    					var color = "#999999";
		    				}else if (datum.get('comptage') > interval * 7 && datum.get('comptage') <= interval * 8) {
		    					var color = "#888888";
		    				}else if (datum.get('comptage') > interval * 8 && datum.get('comptage') <= interval * 9) {
		    					var color = "#777777";
		    				}else if (datum.get('comptage') > interval * 9 && datum.get('comptage') <= interval * 10) {
		    					var color = "#666666";
		    				}else if (datum.get('comptage') > interval * 10 && datum.get('comptage') <= interval * 11) {
		    					var color = "#555555";
		    				}else if (datum.get('comptage') > interval * 11 && datum.get('comptage') <= interval * 12) {
		    					var color = "#444444";
							}else if (datum.get('comptage') > interval * 12 && datum.get('comptage') <= interval * 13) {
		    					var color = "#333333";
		    				}else if (datum.get('comptage') > interval * 13 && datum.get('comptage') <= interval * 14) {
		    					var color = "#222222";
		    				}else if (datum.get('comptage') > interval * 14 && datum.get('comptage') <= interval * 15) {
		    					var color = "#111111";
							}else if (datum.get('comptage') > interval * 15 && datum.get('comptage') <= 5 * limit) {
								var color = "#000000";
		    				}else if (datum.get('comptage') > 5 * limit) {
		    					var color = "#FF0000";
		    				}

							var date = moment(datum.get('date')).format('YYYY-MM-DD');
							var step = 3;
							var period = 5;
							var hour = encodeURIComponent(moment(datum.get('date')).format('HH:mm'));

		    				var url = '#/id/' + id 
								+ '/date/' + date
								+ '/step/' + step
								+ '/period/' + period
								+ '/hour/' + hour;

							data.push({x: column, y: row, value: count, color: color, url: url});
						});
					}else{
						for (var i=0; i<720; i++) {
							data.push({x: column, y: i, value: null, color: "blue"});
						}
					}

					self.createDataHelper(ids, column+1, data, names, dates, self);
				}
			});
		}else{
			self.makeTable(names, dates, data);
		}
	},

	makeHeader: function(names) {
		var data = [];
		var dates = [];
		for (var i=0; i<names.length; i++) {
			data.push([i,0,0]);
			dates.push(0);
		}

		var chart = new Highcharts.Chart({
	        chart: {
	            type: 'heatmap',
	            renderTo: header,
	            height: 200,
	            marginTop: 200,
	            marginBottom: 0,
	            spacingLeft: 114,
	            spacingRight: 25
	        },
	        title: {
	            text: null
	        },
	        xAxis: {
	            categories: names,
	            opposite: true,
	            labels: {
	                rotation: 315
	            }
	        },
	        yAxis: {
	            title: {
	                text: null
	            },
	            height: 0, 
	            labels: {
	                enabled: false
	            },
	            categories: dates,
	        },
	        legend: {
	        	enabled: false
	        },
	        series: [{
	            data: data
	        }]
		});
	},

	scroll: function() {
		var fixedHeader = $('#header');
		var scroll = $(window).scrollTop();
			console.log(scroll);
		if (scroll >= 250) {
			fixedHeader.addClass('fixed');
		}else{
			fixedHeader.removeClass('fixed');
		}
	},

	remove: function() {
		$(window).off(this.detect_scroll);
		Backbone.Marionette.CollectionView.prototype.remove.apply(this, arguments);
	},

});
