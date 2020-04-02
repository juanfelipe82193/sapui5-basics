/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
sap.ui.define(['sap/apf/ui/representations/BaseVizFrameChartRepresentation','sap/apf/core/constants','sap/apf/ui/utils/constants'],function(B,c,u){"use strict";function l(a,p){B.apply(this,[a,p]);this.type=u.representationTypes.LINE_CHART;this.chartType=u.vizFrameChartTypes.LINE;this._addDefaultKind();}l.prototype=Object.create(B.prototype);l.prototype.constructor=l;l.prototype._addDefaultKind=function(){this.parameter.measures.forEach(function(m){if(m.kind===undefined){m.kind=c.representationMetadata.kind.YAXIS;}});this.parameter.dimensions.forEach(function(d,i){if(d.kind===undefined){d.kind=i===0?c.representationMetadata.kind.XAXIS:sap.apf.core.constants.representationMetadata.kind.LEGEND;}});};l.prototype.getAxisFeedItemId=function(k){var s=c.representationMetadata.kind;var a;switch(k){case s.XAXIS:a=c.vizFrame.feedItemTypes.CATEGORYAXIS;break;case s.YAXIS:a=c.vizFrame.feedItemTypes.VALUEAXIS;break;case s.LEGEND:a=c.vizFrame.feedItemTypes.COLOR;break;default:break;}return a;};sap.apf.ui.representations.lineChart=l;return l;},true);
