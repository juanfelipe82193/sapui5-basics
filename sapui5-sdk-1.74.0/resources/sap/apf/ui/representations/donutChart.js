/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.require("sap.apf.ui.representations.BaseVizFrameChartRepresentation");jQuery.sap.require("sap.apf.core.constants");jQuery.sap.declare("sap.apf.ui.representations.donutChart");(function(){"use strict";sap.apf.ui.representations.donutChart=function(a,p){sap.apf.ui.representations.BaseVizFrameChartRepresentation.apply(this,[a,p]);this.type=sap.apf.ui.utils.CONSTANTS.representationTypes.DONUT_CHART;this.chartType=sap.apf.ui.utils.CONSTANTS.vizFrameChartTypes.DONUT;};sap.apf.ui.representations.donutChart.prototype=Object.create(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype);sap.apf.ui.representations.donutChart.prototype.getAxisFeedItemId=function(k){var s=sap.apf.core.constants.representationMetadata.kind;var a;switch(k){case s.SECTORCOLOR:a=sap.apf.core.constants.vizFrame.feedItemTypes.COLOR;break;case s.SECTORSIZE:a=sap.apf.core.constants.vizFrame.feedItemTypes.SIZE;break;default:break;}return a;};}());
