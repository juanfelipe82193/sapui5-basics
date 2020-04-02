/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['./library'],function(l){"use strict";var C={apiVersion:2};C.CSS_CLASS="sapUiMDCChart";C.render=function(r,c){r.openStart("div",c);r.class(C.CSS_CLASS);r.class("sapUiFixFlex");r.style("overflow","hidden");r.style("height",c.getHeight());r.style("width",c.getWidth());r.style("min-height",c.getMinHeight());r.style("min-width",c.getMinWidth());r.openEnd();this.renderToolbar(r,c.getAggregation("_toolbar"));this.renderBreadcrumbs(r,c.getAggregation("_breadcrumbs"));this.renderChart(r,c.getAggregation("_chart"));r.close("div");};C.renderToolbar=function(r,t){if(t){r.openStart("div");r.class("sapUiFixFlexFixed");r.openEnd();r.renderControl(t);r.close("div");}};C.renderBreadcrumbs=function(r,d){if(d){r.renderControl(d);}};C.renderChart=function(r,c){if(c){r.openStart("div");r.class("sapUiFixFlexFlexible");r.style("overflow","hidden");r.openEnd();r.openStart("div");r.class("sapUiFixFlexFlexibleContainer");r.openEnd();r.renderControl(c);r.close("div");r.close("div");}};return C;},true);
