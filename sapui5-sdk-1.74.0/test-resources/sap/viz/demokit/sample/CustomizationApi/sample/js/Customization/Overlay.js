/*global d3, $ */
/*eslint no-console: 1, no-alert: 1, no-unused-vars: 1 */
/* Note: this file uses console or alert statements for illustration purposes
 * and defines more variables than the current code requires.
 */
sap.ui.define(function() {
    "use strict";

    var OverLayCustomization = sap.viz.extapi.core.BaseCustomOverlay.extend();

    OverLayCustomization.id = "com.sap.viz.custom.infoColumn.overlay";
    OverLayCustomization.metadata = {
        propertyDefinition: {
            indicatorColor: {
                defaultValue: null
            }
        },
        eventDefinition: []
    };

    OverLayCustomization.prototype.init = function() {
        console.log('OverLayCustomization.prototype.init');
    };

    OverLayCustomization.prototype.render = function(changes, vizModelInfo, renderInfo) {
        console.log('OverLayCustomization.prototype.render');
        window.renderInfo = renderInfo;

        var customerizationLayer = this.container();
        if (customerizationLayer) {
            var svgContainer = d3.select(customerizationLayer).selectAll("svg").data(['svg_container']);
            svgContainer.attr("width", this.vizInstanceInfo().size().width).attr("height", this.vizInstanceInfo().size().height);
            svgContainer.enter().append("svg")
                .attr("width", this.vizInstanceInfo().size().width)
                .attr("height", this.vizInstanceInfo().size().height)
                .style('pointer-events', "none");
            svgContainer.exit().remove();

            var dataPoints = renderInfo.plot().dataPoints();
            var categoryAxis = renderInfo.categoryAxis();

            _insertButton2Title(customerizationLayer, renderInfo);
            _insertMarker2Bar(customerizationLayer, renderInfo);
            _renderLegend(customerizationLayer, renderInfo);
            _renderValueAxis(customerizationLayer, renderInfo);
        }
    };

    OverLayCustomization.prototype.destroy = function() {
        console.log('OverLayCustomization.prototype.destory');
    };


    OverLayCustomization.prototype.overrideProperties = function(vizModelInfo) {
        console.log('OverLayCustomization.prototype.overrideProperties');

        var props = {};
        if (!props.title){
            props.title = {};
        }
        props.title.visible = true;

        // legend
        if (!props.legend){
            props.legend = {};
        }
        props.legend.visible = true;
        if (!props.legend.title){
            props.legend.title = {};
        }
        props.legend.title.visible = true;

        // valueAxis
        if (!props.valueAxis){
            props.valueAxis = {};
        }
        props.valueAxis.visible = true;

        if (!props.valueAxis.title){
            props.valueAxis.title = {};
        }
        props.valueAxis.title.visible = true;

        // categoryAxis
        if (!props.categoryAxis){
            props.categoryAxis = {};
        }
        props.categoryAxis.visible = true;

        if (!props.categoryAxis.title){
            props.categoryAxis.title = {};
        }
        props.categoryAxis.title.visible = true;

        if (!props.interaction){
            props.interaction = {};
        }
        return props;
    };

    OverLayCustomization.prototype.exportToSVGString = function(options) {
        // console.log('OverLayCustomization.prototype.exportToSVGString');
        var node = this.container().childNodes[0];
        var svgString = new XMLSerializer().serializeToString(node);
        return svgString;
    };

    /***************=============================================
     *
     *  overlay detail
     */

    var _renderLegend = function(layer, renderInfo) {
        if (!renderInfo.legend().visible) {
            return;
        }
        var x = renderInfo.legend().x,
            y = renderInfo.legend().y,
            width = renderInfo.legend().width,
            height = renderInfo.legend().height;

        var positionStyle = {
            background: 'aqua',
            position: "absolute",
            left: x + "px",
            top: (y - 20) + "px"
        };
        if ($("#customized_legend_title").length === 0) {
            var $button = $('<input id="customized_legend_title" type="button" value="Customized Legend Title" />');
            $button.css(positionStyle);
            $button.on('click', function() {
                alert("Cool");
            });
            $button.appendTo(layer);
        } else {
            $("#customized_legend_title").css(positionStyle);
        }

    };

    var _renderValueAxis = function(layer, renderInfo) {
        if (!renderInfo.valueAxis().visible) {
            return;
        }
        var axisLine = renderInfo.valueAxis().axisLine;
        var x = axisLine.x1,
            y = axisLine.y1;
        var paths = ['M13.909,23.563c-5.376,0-9.75-4.374-9.75-9.75s4.374-9.75,9.75-9.75s9.75,4.374,9.75,9.75c0,1.966-0.589,3.794-1.594,5.328' +
            'l1.393,1.393l1.308-0.069c1.193-1.939,1.894-4.213,1.894-6.652c0-7.03-5.72-12.75-12.75-12.75s-12.75,5.72-12.75,12.75' +
            's5.72,12.75,12.75,12.75c2.439,0,4.713-0.701,6.653-1.894l0.068-1.307l-1.394-1.394C17.703,22.973,15.875,23.563,13.909,23.563z',
            'M20.369,17.445c0.607-1.075,0.957-2.313,0.957-3.632c0-4.09-3.328-7.417-7.417-7.417s-7.417,3.328-7.417,7.417' +
            's3.328,7.417,7.417,7.417c1.32,0,2.558-0.351,3.632-0.957l-2.277-2.278c-0.43,0.14-0.879,0.235-1.355,0.235' +
            'c-2.436,0-4.417-1.981-4.417-4.417s1.981-4.417,4.417-4.417s4.417,1.981,4.417,4.417c0,0.476-0.095,0.925-0.234,1.354' +
            'L20.369,17.445z',
            'M14.909,12.813c0.401,0,0.784,0.117,1.11,0.336c-0.284-0.901-1.116-1.558-2.11-1.558c-1.227,0-2.222,0.995-2.222,2.222' +
            'c0,0.995,0.659,1.828,1.561,2.111c-0.52-0.777-0.438-1.839,0.248-2.525C13.873,13.021,14.375,12.813,14.909,12.813z',
            'M30.548,25.935l-4.282-4.282c-0.151-0.151-0.355-0.235-0.568-0.235c-0.014,0-0.028,0-0.042,0.001l-2.592,0.136l-7.45-7.45' +
            'c-0.195-0.195-0.451-0.293-0.707-0.293s-0.512,0.098-0.707,0.293c-0.391,0.391-0.391,1.023,0,1.414l7.45,7.45l-0.136,2.591' +
            'c-0.012,0.227,0.073,0.449,0.234,0.609l4.301,4.302c0.152,0.152,0.357,0.235,0.567,0.235c0.073,0,0.146-0.01,0.219-0.03' +
            'c0.279-0.079,0.495-0.303,0.562-0.586l0.436-1.829c0.071-0.299,0.307-0.531,0.607-0.597l1.713-0.379' +
            'c0.286-0.063,0.515-0.277,0.597-0.559C30.833,26.445,30.755,26.142,30.548,25.935z'
        ];

        var marker = d3.select(".v-custom-overlay-Layer").select("svg").selectAll("g.axisMarker").data(['AxisMarker']);
        marker.attr("transform", "translate (" + (x - 10) + ", " + (y - 20) + ")");
        marker.enter().append("g").attr("class", "axisMarker")
            .attr("transform", "translate (" + (x - 10) + ", " + (y - 20) + ")").selectAll('path').data(paths).enter()
            .append('path').attr("d", function(d) {
                return d;
            });
        marker.exit().remove();
    };


    var _queryContext = function(layer, renderInfo) {
        var $button = $("input[type='button']");
        $button.on('click', function() {
            var key = $("input[name='key']").val();
            var context = $("input[name='context']").val();
            context = jQuery.parseJSON(context);
            var result = null;
            if (document.getElementById("rd1").checked) {
                result = renderInfo.legend().get(key, context);
            } else if (document.getElementById("rd2").checked) {
                result = renderInfo.categoryAxis().get(key, context);
            } else if (document.getElementById("rd3").checked) {
                result = renderInfo.plot().get(key, context);
            }
            alert(JSON.stringify(result));
        });
    };

    var _insertButton2Title = function(layer, renderInfo) {
        if (!renderInfo.title().visible) {
            return;
        }
        var x = renderInfo.title().x,
            y = renderInfo.title().y,
            width = renderInfo.title().width,
            height = renderInfo.title().height;

        var positionStyle = {
            position: "absolute",
            left: (x + width + 10) + "px",
            top: y + "px"
        };
        if ($("#customized_button").length === 0) {
            var $button = $('<input id="customized_button" type="button" value="I am a customized button" />');
            $button.css(positionStyle);
            $button.on('click', function() {
                alert("Rolf Hichert is our german visualization guru.");
            });
            $button.appendTo(layer);
        } else {
            $("#customized_button").css(positionStyle);
        }

    };

    var _insertMarker2Bar = function(layer, renderInfo) {
        if (!renderInfo.plot().visible) {
            return false;
        }
        var datapoint = renderInfo.plot().dataPoints();
        while (Array.isArray(datapoint) && datapoint.length > 0) {
            datapoint = datapoint[datapoint.length - 1];
        }

        var x = datapoint.x,
            y = datapoint.y,
            width = datapoint.width,
            height = datapoint.height;

        var marker = d3.select(".v-custom-overlay-Layer").select("svg").selectAll("g.barMarker").data(['BarMarker']);
        marker.attr("transform", "translate (" + (x + 15 * width / 50) + ", " + (y + 5 * width / 50) + ") rotate(30) scale(" + (width / 50) + "," + (width / 50) + ")");
        marker.enter().append("g").attr("class", "barMarker")
            .attr("transform", "translate (" + (x + 15 * width / 50) + ", " + (y + 5 * width / 50) + ") rotate(30) scale(" + (width / 50) + "," + (width / 50) + ")")
            .append('path').attr("fill", "#FF0000")
            .attr("d", 'M31.793,8.977c-0.738-0.299-1.823-1.708-2.974-3.198C26.731,3.07,24.364,0,21.813,0c-3.37,0-5.209,2.047-5.845,2.93 ' +
                'c-0.712-0.8-2.66-2.656-5.398-2.656c-2.15,0-4.771,3.077-7.081,5.792C2.155,7.632,0.895,9.111,0.222,9.34 ' +
                'C0.095,9.384,0.008,9.5,0,9.633s0.066,0.259,0.188,0.316c1.13,0.533,2.288,1.971,3.629,3.635c1.876,2.33,4.003,4.97,6.828,6.054 ' +
                'c1.72,0.66,3.569,0.981,5.654,0.981c1.994,0,3.927-0.304,5.387-0.568c2.51-0.455,6.262-5.444,8.504-8.425 ' +
                'c0.716-0.953,1.457-1.938,1.643-2.058c0.109-0.062,0.175-0.182,0.166-0.308C31.991,9.134,31.912,9.024,31.793,8.977z M28.328,9.951 ' +
                'c-1.491,0.986-5.219,2.993-11.191,3.267c-6.171,0.279-10.729-1.902-12.681-3.06C5.785,9.848,6.912,9.223,7.926,8.66 ' +
                'c1.149-0.637,2.143-1.188,3.179-1.188c1.281,0,2.544,0.415,3.558,0.749c0.814,0.268,1.46,0.478,1.934,0.443 ' +
                'c0.427-0.028,0.992-0.195,1.646-0.39c0.996-0.295,2.235-0.662,3.429-0.662c0.859,0,1.959,0.511,3.124,1.053 ' +
                'C25.952,9.205,27.141,9.758,28.328,9.951z');
        marker.exit().remove();
    };

    return OverLayCustomization;

});