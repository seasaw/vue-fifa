new Vue({
        el: '#myVueApp',
        data: {
            apiData: undefined,
            selectedCountry: undefined,
            showDetails: false,
            playerDialog: false,
            selectedPlayer: undefined
        },
        methods: {
            loadApi: function () {
                this.$http.get('data/data.json').
                then(this.successCallback, this.errorCallback);
            },
            successCallback: function (response) {
                this.apiData = response.data;
                console.log('successCallback response', this.apiData);
            },
            errorCallback: function (response) {
                console.log('errorCallback response', response);
            },
            selectionChange: function (response) {
                console.log('selectionChanged:this.selectedCountry', this.selectedCountry);
            },
            toggleDetails: function (response) {
                this.showDetails = !this.showDetails;
            },
            openPlayerDialog: function (player) {
                console.log('load player', player);
                this.selectedPlayer = player;
                this.playerDialog = true;
                drawChart(player);
            }

        },
        created: function(){
            this.loadApi()
        }
    }

);


var getChartData = function(player_data){
    var keys_list = ['def', 'dri', 'overall', 'pac', 'pas', 'phy', 'sho'];
    data = [];

    for(var i = 0; i < keys_list.length; i++) {
        var t_key = keys_list[i];
        data.push(
            {
                "label" : t_key,
                "value" : player_data[t_key]
            }
        );
    }

    console.log('get barchar data', data);

    data_chart = [{
        key: "player_data_chart",
        values: data
    }]
    return data_chart;

};

var drawChart = function (player) {
    nv.addGraph(function () {
        var charData = getChartData(player);
        var chart = nv.models.discreteBarChart()
            .x(function (d) {
                return d.label
            })
            .y(function (d) {
                return d.value
            })
            .staggerLabels(true)
            .showValues(true)
            .color(["#2278cf"])

        d3.select('#chart svg')
            .datum(charData)
            .transition().duration(500)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
};