/*global define, sap*/
/*jshint quotmark:false*/

define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/SDKhtml5chart_util",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKArea",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBar",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBarCombination",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBarDualAxis",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBubble",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKColumn",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKColumnCombinationDualAxis",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKColumnDualAxis",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKComb",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKGenericViz",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKHorizontalArea",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKHorizontalCombinationDualAxis",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKHorizontalLine",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKHorizontalWaterfall",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKLine",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKLineDualAxis",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKMultiPie",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKMultiRadar",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKPie",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKRadar",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKScatter",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKStacked100Bar",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKStacked100Col",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKStackedBar",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKStackedColumn",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKStackedWaterfall",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKWaterfall",
    ],
    function(
        SDKAreaChart,
        SDKBarChart,
        SDKBarCombinationChart,
        SDKBarDualAxisChart,
        SDKBubbleChart,
        SDKColumnChart,
        SDKColumnCombinationDualAxisChart,
        SDKColumnDualAxisChart,
        SDKCombinationChart,
        SDKGenericViz,
        SDKHorizontalAreaChart,
        SDKHorizontalCombinationDualAxisChart,
        SDKHorizontalLineChart,
        SDKHorizontalWaterfallChart,
        SDKLineChart,
        SDKLineDualAxisChart,
        SDKMultiPieChart,
        SDKMultiRadarChart,
        SDKPieChart,
        SDKRadarChart,
        SDKScatterChart,
        SDKStacked100BarChart,
        SDKStacked100ColChart,
        SDKStackedBarChart,
        SDKStackedColumnChart,
        SDKStackedWaterfallChart,
        SDKWaterfallChart
        ){

	"use strict";

function SDKHtml5chartUtil() {
	this.createCvomChart = function(chartElementId, chartType){
		var chart;
		var chartControl = sap.ui.getCore().byId(chartElementId);
		if (chartControl) {
			chartControl.destroy();		
	
		}
		chartType = chartType.toLowerCase();
		switch(chartType){
			case 'column':					
				chart = new SDKColumnChart(chartElementId);
				break;	
			case '100_stacked_column':
				chart = new SDKStacked100ColChart(chartElementId);
				break;
			case '100_stacked_bar':
				chart = new SDKStacked100BarChart(chartElementId);
				break;
			case 'stacked_bar':
				chart = new SDKStackedBarChart(chartElementId);
				break;
			case 'stacked_column':
				chart = new SDKStackedColumnChart(chartElementId);
				break;
			case 'stacked_waterfall':
				chart = new SDKStackedWaterfallChart(chartElementId);
				break;	
			case 'line': 
				chart = new SDKLineChart(chartElementId);
				break;			
			case 'bar':
				chart = new SDKBarChart(chartElementId);
				break;
			case 'horizontal_combination':
				chart = new SDKBarCombinationChart(chartElementId);
				break;
			case 'combination':					
				chart = new SDKCombinationChart(chartElementId);
				break;
			case 'horizontal_line':
				chart = new SDKHorizontalLineChart(chartElementId);
				break;
			case 'area':
				chart = new SDKAreaChart(chartElementId);
				break;
			case 'horizontal_area':
				chart = new SDKHorizontalAreaChart(chartElementId);
				break;
			case 'pie':					
				chart = new SDKPieChart(chartElementId);
				break;		
			case 'multi_pie':
				chart = new SDKMultiPieChart(chartElementId);
				break;
			case 'scatter':
				chart = new SDKScatterChart(chartElementId);
				break;
			case 'bubble':
				chart = new SDKBubbleChart(chartElementId);
				break;
			case 'waterfall':
				chart = new SDKWaterfallChart(chartElementId);
				break;
			case 'radar':
				chart = new SDKRadarChart(chartElementId);
				break;
			case 'horizontal_waterfall':
				chart = new SDKHorizontalWaterfallChart(chartElementId);
				break;
			case 'multi_radar':
				chart = new SDKMultiRadarChart(chartElementId);
				break;
			case 'dual_bar':
				chart = new SDKBarDualAxisChart(chartElementId);
				break;	
			case 'dual_combination':
				chart = new SDKColumnCombinationDualAxisChart(chartElementId);
				break;
			case 'dual_column':
				chart = new SDKColumnDualAxisChart(chartElementId);
				break;	
			case 'dual_horizontal_combination':
				chart = new SDKHorizontalCombinationDualAxisChart(chartElementId);
				break;	
			case 'dual_line':
				chart = new SDKLineDualAxisChart(chartElementId);
				break;	
			default:
				chart = new SDKGenericViz(chartElementId);
				chart.setVizId(chartType);
		}		
				
		return chart;
	};
};

return SDKHtml5chartUtil;

});
