/*!
* SAP APF Analysis Path Framework
*
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
sap.ui.define(['sap/apf/ui/representations/BaseVizFrameChartRepresentation','sap/apf/core/constants','sap/apf/ui/utils/constants'],function(B,c,u){"use strict";function P(a,p){B.apply(this,[a,p]);this.type=u.representationTypes.PIE_CHART;this.chartType=u.vizFrameChartTypes.PIE;this._addDefaultKind();};P.prototype=Object.create(B.prototype);P.prototype.constructor=P;P.prototype._addDefaultKind=function(){this.parameter.measures.forEach(function(m){if(m.kind===undefined){m.kind=c.representationMetadata.kind.SECTORSIZE;}});this.parameter.dimensions.forEach(function(d){if(d.kind===undefined){d.kind=c.representationMetadata.kind.SECTORCOLOR;}});};P.prototype.getAxisFeedItemId=function(k){var s=c.representationMetadata.kind;var a;switch(k){case s.SECTORCOLOR:a=c.vizFrame.feedItemTypes.COLOR;break;case s.SECTORSIZE:a=c.vizFrame.feedItemTypes.SIZE;break;default:break;}return a;};sap.apf.ui.representations.pieChart=P;return P;},true);
