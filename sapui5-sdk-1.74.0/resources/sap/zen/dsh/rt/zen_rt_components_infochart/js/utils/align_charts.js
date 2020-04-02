/*global sap */
(function() {

	"use strict";

 	var AlignCharts = function() {
		this.charts = [];
	};

	AlignCharts.prototype.addChart = function(vizFrame) {
		this.charts.push(vizFrame);
	};

	AlignCharts.prototype.alignValueAxis = function(){
		var maxValue = 0;
		var currViz, props;
		for (var i = 0; i < this.charts.length; i++) {
			currViz = this.charts[i];
			props = currViz.getVizFrame().properties();
			if (maxValue < props.categoryAxis.layout.autoHeight){
				maxValue = props.categoryAxis.layout.autoHeight;
			}		
		}
		for (i = 0; i < this.charts.length; i++) {
			currViz = this.charts[i];
			var newProps = { categoryAxis : {layout: {height : maxValue} }};
			props = currViz.getVizFrame().properties();
			if (maxValue !== props.categoryAxis.layout.autoHeight){
				currViz.getVizFrame().properties(newProps);
			}
		}
	}

	sap.zen = sap.zen || {};
	sap.zen.info = sap.zen.info || {} ;
	sap.zen.info.AlignCharts = AlignCharts;
})();