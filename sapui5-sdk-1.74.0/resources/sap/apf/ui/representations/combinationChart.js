/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
*/
jQuery.sap.require("sap.apf.ui.representations.BaseVizFrameChartRepresentation");sap.ui.define(["sap/apf/core/constants","sap/apf/ui/utils/constants"],function(c,u){"use strict";var C=function(a,p){sap.apf.ui.representations.BaseVizFrameChartRepresentation.apply(this,[a,p]);this.type=u.representationTypes.COMBINATION_CHART;this.chartType=u.vizFrameChartTypes.COMBINATION;};C.prototype=Object.create(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype);C.prototype.getAxisFeedItemId=function(k){var s=c.representationMetadata.kind;var a;switch(k){case s.XAXIS:a=c.vizFrame.feedItemTypes.CATEGORYAXIS;break;case s.LEGEND:a=c.vizFrame.feedItemTypes.COLOR;break;case s.YAXIS:a=c.vizFrame.feedItemTypes.VALUEAXIS;break;default:break;}return a;};sap.apf.ui.representations.combinationChart=C;return C;},true);
