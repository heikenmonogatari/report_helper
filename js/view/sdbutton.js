ButtonsView = Backbone.Marionette.ItemView.extend({
    template: "#sdbutton_template",

    events: {
        "click #sd_button" : "showSD",
        "click #nosd_button" : "showNoSD",
        "change #percentile-factor" : "submitPercentileFactor",
        "change #percentile-value" : "submitPercentileValue",
        "click #alphaSort_button" : "sortCountersAlpha",
        "click #worstSort_button" : "sortCountersWorst",
        "click #sdSort_button" : "sortCountersSD",
        "click #unhide_button" : "unhideCounters",
        "click #undoHide_button" : "undoHideCounter",
        "click #hideBlue_button" : "hideBlueCounter",
        "change #dropdownDate_selector" : "changeDate",
        "click #valMode_button" : "valMode",
        "click #normalMode_button" : "norMode",
        "click #validate_button" : "submitStatus",
        "click #invalidate_button": "submitStatus",
        "click #submit_button" : "submit"
    },

    initialize: function(options) {

        this.myModel = options.myModel;

        var factor = $('#stdDev-factor').val();
        var step = this.myModel.get('step');

        var self = this;

        this.collection.forEach(function(counter) {
            var id = counter.get('id');
            var dataList = counter.get('data');
            var statsList = [];

            if (dataList.length) {

                dataList.forEach(function(datum) {
                    datum.set({'day_hour': moment(datum.get('date')).format('dddd_HH')});
                });

                if (step == 3) {
                    for (var i=0; i<168; i++) {
                        if (!dataList.at(i)) break;
                        var dayHourList = dataList.where({day_hour: dataList.at(i).get('day_hour')});
                        statsList[dataList.at(i).get('day_hour')] = self.getStats(dayHourList);
                    }
                }else if (step == 4) {
                     for (var i=0; i<7; i++) {
                        if (!dataList.at(i)) break;
                        var dayHourList = dataList.where({day_hour: dataList.at(i).get('day_hour')});
                        statsList[dataList.at(i).get('day_hour')] = self.getStats(dayHourList);
                    }
                }
            }

            counter.set({'stats': statsList});
        });
    },

    // Initialize date inputs after render
    onShow: function() {
        $('[data-toggle="tooltip"]').tooltip();

        $('.input-group.date.begin').datetimepicker({
            format: "YYYY-MM-DD HH:mm",
            stepping: 15,
            sideBySide: true,
            defaultDate: moment().subtract(1, 'M').startOf('d').format('YYYY-MM-DD HH:mm')
        });

        $('.input-group.date.end').datetimepicker({
            format: "YYYY-MM-DD HH:mm",
            stepping: 15,
            sideBySide: true,
            defaultDate: moment().subtract(1, 'd').endOf('day').subtract(15, 'm').format('YYYY-MM-DD HH:mm')
        });

        $('.input-group.date.refresh').datepicker({
            format: "yyyy-mm-dd"
        });
    },

    // SD button is pressed. Show orange counts
    showSD: function() {
        var factor = $('#stdDev-factor').val();

         this.myModel.set({'sdFactor': factor});

        $(".stdDev").removeClass("stdDev");

        var self = this;

        this.collection.forEach(function(counter) {
            var id = counter.get('id');
            var dataList = counter.get('data');
            var statsList = counter.get('stats');

            if (dataList.length) {

                dataList.forEach(function(count) {

                    var stats = self.getDateStats(statsList, count.get('day_hour'));

                    var average = stats[0];
                    var std_dev = stats[1];

                    if (count.get('comptage') > average + factor * std_dev && count.get('comptage') != 0) {
                        var date = moment(count.get('date')).format('YYYY-MM-DD');
                        var hour = moment(count.get('date')).format('HH:mm');

                        $('div[hour="'+hour+'"][idNum="'+id+'"][date="'+date+'"]').addClass("stdDev");
                    }
                });
            }
        });
    },

    // No SD button is pressed. Remove orange counts
    showNoSD: function() {
        $(".stdDev").removeClass("stdDev");
    },

    // Get stats for that hour/day. 
    getStats: function(dayHourList) {
        var sum = 0

        for (var i in dayHourList) {
            sum += dayHourList[i].get('comptage');
        }
        
        var average = sum / dayHourList.length;
        var sqSum = 0;

        for (var i in dayHourList) {
            sqSum += Math.pow(dayHourList[i].get('comptage') - average, 2);
        }

        return [average, Math.sqrt(sqSum / dayHourList.length)];
    },

    // return stats at the specific date_hour
    getDateStats: function(list, date_hour) {
        return list[date_hour];
    },

    // Percentile factor number has been changed.
    submitPercentileFactor: function() {
        //Backbone.globalEvent.trigger('factorChange', $('#percentile-factor').val());
        this.myModel.set({percentileFactor: $('#percentile-factor').val()});
    },

    // Percentile rank has been changed.
    submitPercentileValue: function() {
        this.myModel.set({percentile: $('#percentile-value').val()});
    },

    // Sort counters alphanumerically. Numbers comes before letters. 12 comes after 2
    // example: [1, 2, 11, 12] and NOT [1, 11, 12, 2]
    sortCountersAlpha: function() {

        var list =  $(".color-table").children('.counter');

        function alphanum(a, b) {
            function chunkify(t) {
                var tz = new Array();
                var x = 0, y = -1, n = 0, i, j;

                while (i = (j = t.charAt(x++)).charCodeAt(0)) {
                    var m = (i == 46 || (i >=48 && i <= 57));
                    if (m !== n) {
                        tz[++y] = "";
                        n = m;
                    }
                    tz[y] += j;
                }
                return tz;
            }

            var aa = chunkify(a.getAttribute('name'));
            var bb = chunkify(b.getAttribute('name'));
    
            for (x = 0; aa[x] && bb[x]; x++) {
                if (aa[x] !== bb[x]) {
                    var c = Number(aa[x]), d = Number(bb[x]);
                    if (c == aa[x] && d == bb[x]) {
                        return c - d;
                    } else return (aa[x] > bb[x]) ? 1 : -1;
                }
            }
                return aa.length - bb.length;
        }

        list.sort(alphanum).appendTo('.color-table');
    },

    // Sort by RED. Red will go left, blue will go right. Red has priority over blue. if {r: redCounts, b: blueCounts},
    // {1, 99} will appear on the LEFT of {0, 1}.
    // {0, 1} will appear on the left of {0, 99}.
    sortCountersWorst: function() {

        var list =  $(".color-table").children('.counter');

        function sortWorst(a, b) {

            var aRedCount = $('.c17', $(a)).length;

            var bRedCount = $('.c17', $(b)).length;

            var aBlueCount = $('.c18', $(a)).length;

            var bBlueCount = $('.c18', $(b)).length;

            if (aRedCount && bRedCount) {
                return bRedCount - aRedCount;
            }else if (aRedCount && !(bRedCount)) {
                return -1;
            }else if (bRedCount && !(aRedCount)) {
                return 1;
            }else{
                return aBlueCount - bBlueCount;
            }
        }

        list.sort(sortWorst).appendTo('.color-table');

        console.log("List of Red Counts: "); 
        list.each(
          function() {
            console.log($(this).attr('name') + " " + $('.c17', $(this)).length);
          }
        );
    },

    // Same sort as sortCountersWorst but with orange instead of red
    sortCountersSD: function() {
        var list =  $(".color-table").children('.counter');

        function sortSD(a, b) {

            var aOrangeCount = $('.stdDev', $(a)).length;

            var bOrangeCount = $('.stdDev', $(b)).length;

            var aBlueCount = $('.c18', $(a)).length;

            var bBlueCount = $('.c18', $(b)).length;

            if (aOrangeCount && bOrangeCount) {
                return bOrangeCount - aOrangeCount;
            }else if (aOrangeCount && !(bOrangeCount)) {
                return -1;
            }else if (bOrangeCount && !(aOrangeCount)) {
                return 1;
            }else{
                return aBlueCount - bBlueCount;
            }
        }

        list.sort(sortSD).appendTo('.color-table');

        console.log("List of Orange Counts: "); 
        list.each(
          function() {
            console.log($(this).attr('name') + " " + $('.stdDev', $(this)).length);
          }
        );
    },

    // Unhide All has been pressed. Unhide all counters that were stored in this.myModel.hidden
    unhideCounters: function() {
        var ids = this.myModel.get('hidden');

        for (i in ids) {
            console.log(ids[i]);
            $('.counter[idnum='+ids[i]+']').show();
        }

        this.myModel.set({'hidden': []}); // reset the hidden list to empty

        $('input[type=checkbox]').prop('checked', false);
    },

    // Unhide Last has been pressed. Unhide the last counter that had been pushed into this.myModel.hidden
    undoHideCounter: function() {
        $('.counter[idnum='+this.myModel.get('hidden').pop()+']').show();
        $('input[type=checkbox]').prop('checked', false);
    },

    // Remove Blue Columns has been pressed. Hide all completely blue columns. Push counters into this.myModel.hidden
    hideBlueCounter: function() {
        var list =  $(".color-table").children('.counter');
        var self = this;

        list.each(function(index, counter) {

            var nbData = $(counter).children().length - 1;
            var nbBlue = $(counter).children('.c18').length;

            if (nbData == nbBlue) {
                $(counter).hide();
                self.myModel.get('hidden').push($(counter).attr('idnum'));
            }
        });
    },

    changeDate: function() {
        console.log("Period changed...");

        if ($("#dropdownDate_selector").val() == 0 && $("#date_Start").val()) {
            this.myModel.set({end: moment($("#date_End").val()).endOf('day').format('YYYY-MM-DD')});
            this.myModel.set({begin: moment($("#date_Start").val()).startOf('day').format('YYYY-MM-DD')});
        } else if ($("#dropdownDate_selector").val() == 0) {
            this.myModel.set({end: moment().endOf('day').subtract(1, 'day').format('YYYY-MM-DD')});
            this.myModel.set({begin: moment().subtract(1, 'month').startOf('day').format('YYYY-MM-DD')});
        } else if ($("#dropdownDate_selector").val() == 2) {
            this.myModel.set({end: moment().endOf('day').subtract(1, 'day').format('YYYY-MM-DD')});
            this.myModel.set({begin: moment().subtract(1, 'week').startOf('day').format('YYYY-MM-DD')});
        } else if ($("#dropdownDate_selector").val() == 3) {
            this.myModel.set({end: moment().subtract(1, 'week').endOf('week').add(1, 'day').format('YYYY-MM-DD')});
            this.myModel.set({begin: moment().subtract(1, 'week').startOf('week').add(1, 'd').format('YYYY-MM-DD')});
        } else if ($("#dropdownDate_selector").val() == 4) {
            this.myModel.set({end: moment().subtract(1, 'day').endOf('day').format('YYYY-MM-DD')});
            this.myModel.set({begin: moment().subtract(1, 'month').startOf('day').format('YYYY-MM-DD')});
        } else if ($("#dropdownDate_selector").val() == 5) {
            this.myModel.set({end: moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')});
            this.myModel.set({begin: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')});
        } else if ($("#dropdownDate_selector").val() == 6) {
            this.myModel.set({end: moment().subtract(1, 'day').endOf('day').format('YYYY-MM-DD')});
            this.myModel.set({begin: moment().subtract(3, 'month').startOf('day').format('YYYY-MM-DD')});
        } else if ($("#dropdownDate_selector").val() == 7) {
            this.myModel.set({end: moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')});
            this.myModel.set({begin: moment().subtract(4, 'month').startOf('month').format('YYYY-MM-DD')});
        }

        this.myModel.set({period: $("#dropdownDate_selector").val()})

        MyApp.trigger("refreshTable", this.collection);
    },

    // validation mode
    valMode: function() {
        $('.vertical-text2').each(function(i, obj) {
            $(this).children('input').attr('class', "validateMe");
        });

        $('.validationOpts').show();
    },

    // normal mode
    norMode: function() {
        $('.vertical-text2').each(function(i, obj) {
            $(this).children('input').attr('class', "hideMe");
        });

        $('.validationOpts').hide();
    },

    submitStatus: function(ev) {

        var statusText = $(ev.target).text();

        if (statusText === "Invalidate") {
            var status = 8;
            var activate = 0;
        }else if(statusText === "Validate") {
            var status = 8;
            var activate = 1;
        }

        var begin = $('#date_begin2').val();
        var end = $('#date_end2').val();

        console.log(begin);
        console.log(end);

        $('.vertical-text2').each(function(i, obj) {
            if ($(this).children().is(":checked")) {
                id = $(this).children().attr('id');

                var statusModel = new Backbone.Model({
                    'id': id,
                    'begin': begin + ":00",
                    'end': end + ":00",
                    'status': status,
                    'activate': activate
                });

                statusModel.url = 'https://api.eco-counter-tools.com/v1/' + MyApp.apiKey + '/data/status';

                console.log(statusModel.toJSON());

                // this is a post/put for backbone, using the statusModel just created, at the URL provided
                statusModel.save();

                // Refresh all counters
                Backbone.globalEvent.trigger('fakeRefreshStatus', [id, begin, end, activate]);
            }
        });
    },

    submit: function() {
        var beginM = moment($("#date_begin").val());
        var endM = moment($("#date_end").val());

        var step = $('#step_selector').val();

        this.myModel.set({step: step});

        console.log(step);

        this.myModel.set({begin: beginM.format('YYYY-MM-DD'), end: endM.format('YYYY-MM-DD')});

        MyApp.trigger('refreshTable', this.collection);
    },
});

