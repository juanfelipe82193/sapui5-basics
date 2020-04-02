/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
sap.ui.define(['sap/apf/ui/representations/BaseVizFrameChartRepresentation','sap/apf/core/constants','sap/apf/ui/utils/constants'],function(B,c,u){"use strict";function a(A,p){B.apply(this,[A,p]);this.type=u.representationTypes.COLUMN_CHART;this.chartType=u.vizFrameChartTypes.COLUMN;this._addDefaultKind();}a.prototype=Object.create(B.prototype);a.prototype.constructor=a;a.prototype._addDefaultKind=function(){this.parameter.measures.forEach(function(m){if(m.kind===undefined){m.kind=c.representationMetadata.kind.YAXIS;}});this.parameter.dimensions.forEach(function(d,i){if(d.kind===undefined){d.kind=i===0?c.representationMetadata.kind.XAXIS:c.representationMetadata.kind.LEGEND;}});};a.prototype.getAxisFeedItemId=function(k){var s=c.representationMetadata.kind;var b;switch(k){case s.XAXIS:b=c.vizFrame.feedItemTypes.CATEGORYAXIS;break;case s.YAXIS:b=c.vizFrame.feedItemTypes.VALUEAXIS;break;case s.LEGEND:b=c.vizFrame.feedItemTypes.COLOR;break;default:break;}return b;};sap.apf.ui.representations.columnChart=a;return a;},true);
