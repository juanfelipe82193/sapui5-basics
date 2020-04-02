/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
*/
jQuery.sap.require("sap.apf.ui.representations.BaseVizFrameChartRepresentation");sap.ui.define(["sap/apf/core/constants","sap/apf/ui/utils/constants"],function(c,u){"use strict";var D=function(a,p){sap.apf.ui.representations.BaseVizFrameChartRepresentation.apply(this,[a,p]);this.type=u.representationTypes.DUAL_COMBINATION_CHART;this.chartType=u.vizFrameChartTypes.DUAL_COMBINATION;};D.prototype=Object.create(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype);D.prototype.getAxisFeedItemId=function(k){var s=c.representationMetadata.kind;var a;switch(k){case s.XAXIS:a=c.vizFrame.feedItemTypes.CATEGORYAXIS;break;case s.LEGEND:a=c.vizFrame.feedItemTypes.COLOR;break;case s.YAXIS:a=c.vizFrame.feedItemTypes.VALUEAXIS;break;case s.YAXIS2:a=c.vizFrame.feedItemTypes.VALUEAXIS2;break;default:break;}return a;};D.prototype.setVizPropsOfThumbnailForSpecificRepresentation=function(){if(!this.thumbnailChart){return;}this.thumbnailChart.setVizProperties({valueAxis2:{visible:false,title:{visible:false}}});};sap.apf.ui.representations.dualCombinationChart=D;return D;},true);
